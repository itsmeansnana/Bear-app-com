import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../lib/env";
import { parseInitData, verifyTelegramInitData } from "../../../lib/telegram";
import { supaService } from "../../../lib/supabase";


export async function POST(req: NextRequest){
const { initData } = await req.json();
const ok = verifyTelegramInitData(initData||"", env.BOT_TOKEN);
if(!ok) return NextResponse.json({ ok:false, message:"Invalid initData" }, { status:401 });
const { user } = parseInitData(initData);
if(!user) return NextResponse.json({ ok:false, message:"No user" }, { status:400 });


if(env.USE_MOCK || !supaService){
// mock profile in memory-esque
return NextResponse.json({ ok:true, profile:{ user_id:String(user.id), username:user.username, balance:0.012, total_earned:0.012, referral_code: String(user.id) } });
}


// upsert profile
const referral_code = String(user.id);
const { data, error } = await supaService
.from("profiles")
.upsert({ user_id: String(user.id), username: user.username, first_name: user.first_name, last_name: user.last_name, referral_code }, { onConflict:"user_id" })
.select("user_id, username, balance, total_earned, referral_code").single();
if(error) return NextResponse.json({ ok:false, message:error.message }, { status:500 });
return NextResponse.json({ ok:true, profile:data });
}
