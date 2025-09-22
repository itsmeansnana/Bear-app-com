import NumberFmt from "./ui/Number";


export function BalanceCard({balance,total}:{balance:number,total:number}){
return (
<div className="card p-6 mb-6">
<div className="text-center">
<div className="text-muted text-lg">Your Balance</div>
<div className="text-4xl font-extrabold text-limey tracking-wide">{balance.toFixed(6)} USDT</div>
<div className="text-muted mt-2">Total Earned: <NumberFmt value={total}/> USDT</div>
</div>
</div>
);
}


export function DayGrid({streak, claimed}:{streak:number, claimed:number[]}){
const steps = [0.002,0.004,0.006,0.008,0.010,0.012,0.014,0.016,0.018];
return (
<div className="card p-4">
<div className="grid grid-cols-3 gap-4">
{steps.map((amt,i)=>{
const day = i+1; const done = claimed.includes(day);
return (
<div key={day} className="bg-card2 rounded-2xl p-4 text-center border border-border">
<div className="text-muted">Day {day}</div>
<div className="mt-2 text-white font-bold">{amt.toFixed(3)}</div>
</div>
);
})}
</div>
<button className="btn btn-ghost w-full mt-6" id="claim-btn">Claim Day 1</button>
</div>
);
}


export function TaskItem({title,reward,href,icon}:{title:string,reward:number,href:string,icon:React.ReactNode}){
return (
<a href={href} target="_blank" className="block card p-4 mb-3">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center border border-border">{icon}</div>
<div className="flex-1">
<div className="font-semibold">{title}</div>
</div>
<div className="text-sm bg-[#1f2a19] text-limey px-3 py-1 rounded-full">{reward.toFixed(3)}</div>
</div>
</a>
);
}
