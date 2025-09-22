import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { parseInitData, verifyTelegramInitData } from "../../../../lib/telegram";
import { supaService } from "../../../../lib/supabase";


export async function POST(req: NextRequest){
const { initData } = await req.json();
if(!verifyTelegramInitData(initData||"", env.BOT_TOKEN)) return NextResponse.json({ ok:false },{status:401});
const { user } = parseInitData(initData);
if(!user) return NextResponse.json({ ok:false },{status:400});


let code = String(user.id);
if(!env.USE_MOCK && supaService){
const { data } = await supaService.from("profiles").select("referral_code").eq("user_id", String(user.id)).single();
if(data?.referral_code) code = data.referral_code;
}
const link = `https://t.me/${env.BOT_USERNAME}?start=${code}`;
return NextResponse.json({ ok:true, link });
}
