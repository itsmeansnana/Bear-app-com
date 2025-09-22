-- SCHEMA for Bear App (idempotent where possible)
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
