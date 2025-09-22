import Link from "next/link";
import { Icons } from "./Icons";
import { clsx } from "clsx";


export default function Shell({children, active}:{children:React.ReactNode, active:string}){
const Nav = [
{href:"/", label:"Home", icon: Icons.Home},
{href:"/earn", label:"Earn", icon: Icons.SquareChartGantt},
{href:"/refer", label:"Refer", icon: Icons.Users},
{href:"/withdraw", label:"Withdraw", icon: Icons.Wallet2},
{href:"/about", label:"About", icon: Icons.Info},
];
return (
<div className="min-h-dvh">
<div className="container py-6">
{children}
</div>
<nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-xl bg-[#0b0e13ee] backdrop-blur border-t border-border">
<div className="grid grid-cols-5 gap-0 px-2 py-3">
{Nav.map(n=>{
const Icon = n.icon;
const on = active===n.href;
return (
<Link key={n.href} href={n.href} className="flex flex-col items-center gap-1">
<div className={clsx("w-12 h-12 rounded-full flex items-center justify-center",
on?"bg-limey text-black shadow-soft":"bg-card2 text-white border border-border")}>
<Icon size={22}/>
</div>
<span className="text-xs text-muted">{n.label}</span>
</Link>
);
})}
</div>
</nav>
<div className="h-24" />
</div>
);
}
