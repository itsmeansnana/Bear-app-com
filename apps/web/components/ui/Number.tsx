export default function NumberFmt({value, unit}:{value:number|string, unit?:string}){
const n = typeof value === "number" ? value : Number(value);
return <span>{n.toFixed(6)}{unit?` ${unit}`:""}</span>;
}
