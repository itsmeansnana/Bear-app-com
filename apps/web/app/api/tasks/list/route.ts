import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../../lib/env";
import { defaultTasks } from "../../../../lib/tasks";
import { supaService } from "../../../../lib/supabase";


export async function GET(){
if(env.USE_MOCK || !supaService) return NextResponse.json({ ok:true, tasks: defaultTasks });
const { data, error } = await supaService.from("tasks").select("id,title,reward,url,category,icon").eq("is_active", true).order("id");
if(error) return NextResponse.json({ ok:false, message:error.message },{status:500});
return NextResponse.json({ ok:true, tasks: data });
}
