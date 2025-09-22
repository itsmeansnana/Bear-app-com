import Shell from "../../components/Shell";


export default function Page(){
return (
<Shell active="/refer">
<h1 className="text-2xl font-extrabold mb-6">Refer</h1>
<div className="card p-5">
<div className="text-lg font-bold">Refer & Earn Forever <span className="ml-2 text-black bg-limey px-2 py-0.5 rounded-full text-sm">10%</span></div>
<ol className="list-decimal pl-6 space-y-1 mt-3 text-muted">
<li>Copy Your Link</li>
<li>Share with Friends</li>
<li>Earn Lifetime Rewards</li>
</ol>
<div className="mt-4">
<label className="label">Your Referral Link</label>
<div className="flex gap-2">
<input id="refLink" className="input" readOnly value="https://t.me/YourBot?start=" />
<button className="btn btn-primary" id="copyBtn">Copy</button>
</div>
<div className="flex gap-2 mt-4">
<a className="btn btn-ghost flex-1 text-center" href="#">Telegram</a>
<a className="btn btn-ghost flex-1 text-center" href="#">WhatsApp</a>
<a className="btn btn-ghost flex-1 text-center" href="#">Twitter/X</a>
</div>
</div>
</div>
<script dangerouslySetInnerHTML={{__html:`(async function(){
const tg = window.Telegram?.WebApp; const initData=tg?.initData||'';
const j = await (await fetch('/api/refer/link',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({initData})})).json();
const el=document.getElementById('refLink'); if(el) el.value = j.link || el.value;
document.getElementById('copyBtn')?.addEventListener('click',()=>{ navigator.clipboard.writeText(el.value); tg?.showPopup?.({title:'Copied',message:'Referral link copied!'}); });
})();`}} />
</Shell>
);
}
