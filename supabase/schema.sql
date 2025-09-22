-- -- SCHEMA for Bear App (idempotent where possible)
create extension if not exists pgcrypto;


-- 1) Profiles
create table if not exists public.profiles (
user_id uuid primary key,
username text,
first_name text,
last_name text,
balance numeric(20,6) default 0 not null,
total_earned numeric(20,6) default 0 not null,
referral_code text unique,
referred_by uuid references public.profiles(user_id),
created_at timestamptz default now(),
updated_at timestamptz default now()
);


-- 2) Daily claims
create table if not exists public.daily_claims (
id bigserial primary key,
user_id uuid not null references public.profiles(user_id) on delete cascade,
claim_date date not null default current_date,
day_number int not null check(day_number between 1 and 9),
amount numeric(20,6) not null
);
create unique index if not exists uq_daily_once on public.daily_claims(user_id, claim_date);


-- 3) Tasks
create type task_category as enum ('generic','limited','partner');
create table if not exists public.tasks (
id bigserial primary key,
title text not null,
reward numeric(20,6) not null default 0,
url text not null,
category task_category not null default 'generic',
icon text default 'bear',
is_active boolean not null default true,
created_at timestamptz default now()
);


-- 4) Task completions
create table if not exists public.task_completions (
id bigserial primary key,
user_id uuid not null references public.profiles(user_id) on delete cascade,
task_id bigint not null references public.tasks(id) on delete cascade,
reward numeric(20,6) not null,
completed_at timestamptz default now()
);
create unique index if not exists uq_user_task_once on public.task_completions(user_id, task_id);


-- 5) Referrals
create table if not exists public.referrals (
id bigserial primary key,
referrer uuid not null references public.profiles(user_id) on delete cascade,
referee uuid not null references public.profiles(user_id) on delete cascade,
created_at timestamptz default now()
);
create unique index if not exists uq_ref_pair on public.referrals(referrer, referee);


-- 6) Withdraw Requests
create table if not exists public.withdraw_requests (
id bigserial primary key,
user_id uuid not null references public.profiles(user_id) on delete cascade,
amount numeric(20,6) not null,
network text not null,
address text not null,
memo text,
status text not null default 'pending',
created_at timestamptz default now()
);


-- 7) Transactions log (optional)
create table if not exists public.transactions (
id bigserial primary key,
user_id uuid not null references public.profiles(user_id) on delete cascade,
kind text not null, -- 'daily','task','referral','withdraw_lock','withdraw_paid'
amount numeric(20,6) not null,
meta jsonb default '{}'::jsonb,
created_at timestamptz default now()
);


-- 8) RPC: claim daily reward (enforces one per day and 9-day ladder)
create or replace function public.claim_daily_reward(p_user_id uuid)
returns json language plpgsql security definer as $$
declare
today date := current_date;
claimed_today int;
streak int := 0;
reward numeric(20,6);
steps numeric[] := array[0.002,0.004,0.006,0.008,0.010,0.012,0.014,0.016,0.018];
current_day int := 1;
begin
select count(*) into claimed_today from daily_claims where user_id = p_user_id and claim_date = today;
if claimed_today > 0 then
return json_build_object('ok', false, 'message','Already claimed today');
end if;


-- compute streak as # of distinct recent consecutive days
select coalesce(count(*),0) into streak from (
select claim_date from daily_claims where user_id=p_user_id and claim_date >= today - interval '10 days' order by claim_date desc
) s;
current_day := least(streak + 1, 9);
reward := steps[current_day];


insert into daily_claims(user_id, claim_date, day_number, amount) values (p_user_id, today, current_day, reward);
update profiles set balance = balance + reward, total_earned = total_earned + reward, updated_at=now() where user_id = p_user_id;
insert into transactions(user_id, kind, amount, meta) values (p_user_id,'daily',reward, json_build_object('day',current_day));
return json_build_object('ok', true, 'amount', reward, 'day', current_day);
end;
$$;


-- 9) RPC: complete task and reward once per task
create or replace function public.complete_task_and_reward(p_user_id uuid, p_task_id bigint)
returns json language plpgsql security definer as $$
declare
r numeric(20,6);
begin
select reward into r from tasks where id=p_task_id and is_active=true;
if r is null then return json_build_object('ok',false,'message','Task not found'); end if;
begin
insert into task_completions(user_id, task_id, reward) values(p_user_id, p_task_id, r);
exception when unique_violation then
return json_build_object('ok',false,'message','Task already completed');
end;
update profiles set balance = balance + r, total_earned = total_earned + r, updated_at=now() where user_id = p_user_id;
insert into transactions(user_id, kind, amount, meta) values (p_user_id,'task',r, json_build_object('task_id',p_task_id));
return json_build_object('ok', true, 'reward', r);
end;$$;


-- 10) RPC: referral stats
create or replace function public.referral_stats(p_user_id uuid)
returns json language plpgsql security definer as $$
declare
cnt int;
earn numeric(20,6);
begin
select count(*), coalesce(sum(t.amount*0.10),0) into cnt, earn
from transactions t
join referrals r on r.referee = t.user_id
where r.referrer = p_user_id and t.kind in ('daily','task');
return json_build_object('count',cnt,'earnings',coalesce(earn,0));
end;$$;


-- 11) RPC: create withdraw request and lock balance
create or replace function public.create_withdraw_request(p_user_id uuid, p_amount numeric, p_network text, p_address text, p_memo text)
returns void language plpgsql security definer as $$
begin
update profiles set balance = balance - p_amount where user_id=p_user_id and balance >= p_amount;
if not found then raise exception 'Insufficient balance'; end if;
insert into withdraw_requests(user_id, amount, network, address, memo) values(p_user_id, p_amount, p_network, p_address, p_memo);
insert into transactions(user_id, kind, amount, meta) values(p_user_id,'withdraw_lock',-p_amount,json_build_object('network',p_network));
end;$$;
