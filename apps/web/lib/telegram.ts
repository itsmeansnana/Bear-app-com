import crypto from "crypto";


export type TgUser = {
id: number; username?: string; first_name?: string; last_name?: string;
};


export function parseInitData(initData: string){
const params = new URLSearchParams(initData);
const obj: Record<string,string> = {};
for (const [k,v] of params) obj[k] = v;
const user = obj["user"] ? JSON.parse(obj["user"]) as TgUser : undefined;
return {user, data: obj};
}


export function verifyTelegramInitData(initData: string, botToken: string){
const urlParams = new URLSearchParams(initData);
const hash = urlParams.get("hash");
if(!hash) return false;
urlParams.delete("hash");
urlParams.sort();
const dataCheckString = Array.from(urlParams.entries()).map(([k,v])=>`${k}=${v}`).join("\n");
const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
const calc = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
return calc === hash;
}
