export const env = {
BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN!,
BOT_USERNAME: process.env.NEXT_PUBLIC_BOT_USERNAME!,
APP_BASE_URL: process.env.APP_BASE_URL!,
SUPABASE_URL: process.env.SUPABASE_URL!,
SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
REFERRAL_PERCENT: Number(process.env.REFERRAL_PERCENT ?? 0.1),
WITHDRAW_MIN_USDT: Number(process.env.WITHDRAW_MIN_USDT ?? 1),
MAX_DAILY_STREAK: Number(process.env.MAX_DAILY_STREAK ?? 9),
USE_MOCK: (process.env.USE_MOCK_DATA ?? "false").toLowerCase() === "true"
};
