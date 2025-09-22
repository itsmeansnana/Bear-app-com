import { createClient } from "@supabase/supabase-js";
import { env } from "./env";


export const supaAnon = env.SUPABASE_URL && env.SUPABASE_ANON_KEY
? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
: null;


export const supaService = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
: null;
