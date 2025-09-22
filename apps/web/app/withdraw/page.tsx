import Shell from "../../components/Shell";


export default function Page(){
return (
<Shell active="/withdraw">
<h1 className="text-2xl font-extrabold mb-4">Withdraw</h1>
<div className="card p-5">
<label className="label">Amount <span id="available" className="ml-2 text-muted">Available: 0.000000 USDT</span></label>
<div className="flex gap-2">
<input id="amount" placeholder="0.00" className="input" />
<button id="max" className="btn btn-ghost">Max</button>
</div>
<div className="mt-4">
<label className="label">Network</label>
<select id="network" className="input">
<option value="TRON-TRC20">TRON (TRC20)</option>
<option value="BSC-BEP20">BSC (BEP20)</option>
<option value="ETH-ERC20">Ethereum (ERC20)</option>
</select>
</div>
<div className="mt-4">
<label className="label">Wallet</label>
<input id="address" placeholder="Enter address" className="input" />
</div>
<div className="mt-4">
<label className="label">MEMO (optional)</label>
<input id="memo" placeholder="Enter MEMO" className="input" />
</div>
<button id="submit" className="btn btn-ghost w-full mt-6">Request withdraw</button>
</div>
<script dangerouslySetInnerHTML={{__html:`(async function(){
const tg = window.Telegram?.WebApp; const initData=tg?.initData||'';
const init = await (await fetch('/api/init',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({initData})})).json();
document.getElementById('available').textContent = 'Available: '+(init.profile?.balance?.toFixed?.(6) || '0.000000')+' USDT';
document.getElementById('max').addEventListener('click',()=>{ const a=document.getElementById('amount'); a.value = String(init.profile?.balance||0); });
document.getElementById('submit').addEventListener('click', async ()=>{
const payload = {initData, amount: Number(document.getElementById('amount').value||0), network: document.getElementById('network').value, address: document.getElementById('address').value, memo: document.getElementById('memo').value};
const r = await fetch('/api/withdraw/request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); const j=await r.json();
tg?.showPopup?.({title:j.ok?'Submitted':'Error', message: j.message||'Done'});
});
})();`}} />
</Shell>
);
}
