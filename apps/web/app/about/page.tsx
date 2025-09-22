import Shell from "../../components/Shell";


export default function Page(){
return (
<Shell active="/about">
<h1 className="text-2xl font-extrabold mb-4">About</h1>
<div className="card p-6">
<h2 className="font-bold mb-2">Terms of Services</h2>
<ul className="list-disc pl-6 space-y-2 text-muted">
<li>Free and Optional — You can stop using the app anytime.</li>
<li>No Spam or Abuse — Misuse may lead to a ban.</li>
<li>Data Usage — We access minimal necessary Telegram data and never sell it.</li>
<li>Fair Play — No cheats, bots, or exploits.</li>
<li>Changes & Updates — Features may change without notice.</li>
<li>This app isn't affiliated with Telegram.</li>
</ul>
</div>
</Shell>
);
}
