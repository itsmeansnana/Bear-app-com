import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { parseInitData, verifyTelegramInitData } from "../../../../lib/telegram";
import { supaService } from "../../../../lib/supabase";


export async function POST(req: NextRequest){
const { initData, amount, network, address, memo } = await req.json();
if(!verifyTelegramInitData(initData||"", env.BOT_TOKEN)) return NextResponse.json({ ok:false, message:"Invalid" },{status:401});
if(Number(amount) < env.WITHDRAW_MIN_USDT) return NextResponse.json({ ok:false, message:`Minimum withdraw is ${env.WITHDRAW_MIN_USDT} USDT` },{status:400});
const { user } = parseInitData(initData);


if(env.USE_MOCK || !supaService){
return NextResponse.json({ ok:true, message:"(mock) Withdraw request submitted" });
}


const { data: profile, error: e1 } = await supaService.from("profiles").select("balance").eq("user_id", String(user!.id)).single();
if(e1) return NextResponse.json({ ok:false, message:e1.message },{status:400});
if(Number(profile.balance) < Number(amount)) return NextResponse.json({ ok:false, message:"Insufficient balance" },{status:400});


const { error } = await supaService.rpc("create_withdraw_request", { p_user_id: String(user!.id), p_amount: amount, p_network: network, p_address: address, p_memo: memo });
if(error) return NextResponse.json({ ok:false, message:error.message },{status:400});
return NextResponse.json({ ok:true, message:"Withdraw request submitted" });
}
