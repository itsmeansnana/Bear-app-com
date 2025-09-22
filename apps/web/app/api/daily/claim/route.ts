import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { parseInitData, verifyTelegramInitData } from "../../../../lib/telegram";
import { supaService } from "../../../../lib/supabase";
import { dailySteps } from "../../../../lib/rewards";


export async function POST(req: NextRequest){
const { initData } = await req.json();
if(!verifyTelegramInitData(initData||"", env.BOT_TOKEN)) return NextResponse.json({ ok:false, message:"Invalid" },{status:401});
const { user } = parseInitData(initData);
if(!user) return NextResponse.json({ ok:false, message:"No user" },{status:400});


if(env.USE_MOCK || !supaService){
return NextResponse.json({ ok:true, amount: dailySteps[0], message:"(mock) Claimed" });
}


// Server-side atomic claim using RPC
const { data, error } = await supaService.rpc("claim_daily_reward", { p_user_id: String(user.id) });
if(error) return NextResponse.json({ ok:false, message:error.message }, { status:400 });
return NextResponse.json({ ok:true, ...data });
}
