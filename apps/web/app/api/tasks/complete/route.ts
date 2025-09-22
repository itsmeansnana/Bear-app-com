import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { parseInitData, verifyTelegramInitData } from "../../../../lib/telegram";
import { supaService } from "../../../../lib/supabase";


export async function POST(req: NextRequest){
const { initData, task_id } = await req.json();
if(!verifyTelegramInitData(initData||"", env.BOT_TOKEN)) return NextResponse.json({ ok:false, message:"Invalid" },{status:401});
const { user } = parseInitData(initData);
if(!user) return NextResponse.json({ ok:false, message:"No user" },{status:400});


if(env.USE_MOCK || !supaService){
return NextResponse.json({ ok:true, reward:0.002, message:"(mock) Task rewarded" });
}


const { data, error } = await supaService.rpc("complete_task_and_reward", { p_user_id: String(user.id), p_task_id: task_id });
if(error) return NextResponse.json({ ok:false, message:error.message }, { status:400 });
return NextResponse.json({ ok:true, ...data });
}
