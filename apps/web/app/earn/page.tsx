import Shell from "../../components/Shell";
import { TaskItem } from "../../components/Cards";
import { defaultTasks } from "../../lib/tasks";


export default function Page(){
return (
<Shell active="/earn">
<h1 className="text-2xl font-extrabold mb-4">Tasks</h1>
<section className="mb-6">
{defaultTasks.filter(t=>t.category==='generic').map(t=>(
<TaskItem key={t.id} title={t.title} reward={t.reward} href={t.url} icon={<span>🐻</span>} />
))}
</section>
<h2 className="text-muted mb-2">Limited Tasks</h2>
<section className="mb-6">
{defaultTasks.filter(t=>t.category==='limited').map(t=>(
<TaskItem key={t.id} title={t.title} reward={t.reward} href={t.url} icon={<span>✈️</span>} />
))}
</section>
<h2 className="text-muted mb-2">Partner Tasks</h2>
<section>
{defaultTasks.filter(t=>t.category==='partner').map(t=>(
<TaskItem key={t.id} title={t.title} reward={t.reward} href={t.url} icon={<span>🤝</span>} />
))}
</section>
</Shell>
);
}
