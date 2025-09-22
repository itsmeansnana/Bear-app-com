export type Task = { id: number; title: string; reward: number; url: string; category: "limited"|"partner"|"generic"; icon: "tg"|"x"|"bear" };


export const defaultTasks: Task[] = [
{ id: 1, title: "Complete task", reward: 0.002, url: "https://otieu.com/4/9907519", category: "generic", icon: "bear" },
{ id: 2, title: "Complete task", reward: 0.002, url: "https://otieu.com/4/9907513", category: "generic", icon: "bear" },
{ id: 3, title: "Subscribe Telegram channel", reward: 0.002, url: "https://t.me/instanmoneyairdrop", category: "limited", icon: "tg" },
{ id: 4, title: "Subscribe Twitter", reward: 0.002, url: "https://otieu.com/4/9907519", category: "limited", icon: "x" },
{ id: 5, title: "Binance Partner — note: reward from Binance only", reward: 0.002, url: "https://accounts.bmwweb.biz/register?ref=535958866", category: "partner", icon: "tg" },
{ id: 6, title: "KuCoin Partner", reward: 0.002, url: "https://www.kucoin.com/r/rf/QBSTDC9A", category: "partner", icon: "tg" },
{ id: 7, title: "TikTok Partner", reward: 0.002, url: "https://vt.tiktok.com/ZSHn3Hvmpk6a8-IMDAm/", category: "partner", icon: "x" }
];
