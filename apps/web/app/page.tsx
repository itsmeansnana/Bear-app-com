import Shell from "../components/Shell";
import { BalanceCard, DayGrid } from "../components/Cards";


export default async function Page(){
// UI renders static; real data fetched client side by calling /api/init
return (
<Shell active="/">
<h1 className="text-center text-2xl font-extrabold mb-4">Daily reward</h1>
<BalanceCard balance={0.012} total={0.012} />
<DayGrid streak={1} claimed={[1]} />
<ClientSideInit />
</Shell>
);
}


function ClientSideInit(){
return (
<script dangerouslySetInnerHTML={{__html:`
(function(){
const tg = window.Telegram?.WebApp; if(tg){ tg.expand(); }
const initData = tg?.initData || '';
fetch('/api/init', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({initData})})
.then(r=>r.json()).then(x=>{ console.log('init', x); });
const btn = document.getElementById('claim-btn');
if(btn){ btn.addEventListener('click', async ()=>{
const r = await fetch('/api/daily/claim',{method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({initData})});
const j = await r.json(); alert(j.message||('Claimed '+j.amount)); location.reload();
}); }
})();
`}} />
);
}
