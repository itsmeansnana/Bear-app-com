import { NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { parseInitData, verifyTelegramInitData } from "../../../../lib/telegram";
import { supaService } from "../../../../lib/supabase";


export async function POST(req: Request){
const { initData } = await req.json();
if(!verifyTelegramInitData(initData||"", env.BOT_TOKEN)) return NextResponse.json({ ok:false },{status:401});
const { user } = parseInitData(initData);
if(env.USE_MOCK || !supaService) return NextResponse.json({ ok:true, count:0, earnings:0 });
const { data, error } = await supaService.rpc("referral_stats", { p_user_id: String(user!.id) });
if(error) return NextResponse.json({ ok:false, message:error.message },{status:500});
return NextResponse.json({ ok:true, ...data });
}
