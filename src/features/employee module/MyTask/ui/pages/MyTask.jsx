import { useCallback, useEffect, useState } from "react";
import { Check, ClipboardList, RotateCw } from "lucide-react";
import { axiosInstance } from "../../../../../config/axiosInstance";

export default function MyTask() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => { try { const { data }=await axiosInstance.get("/tasks");setTasks(data.data);setError(""); } catch(e){setError(e.response?.data?.message||"Could not load tasks.")} finally{setLoading(false)} },[]);
  useEffect(()=>{load()},[load]);
  const update = async (task,status) => { try { const {data}=await axiosInstance.patch(`/tasks/${task.id}`,{status});setTasks((current)=>current.map((item)=>item.id===task.id?{...item,...data.data}:item));setError(""); } catch(e){setError(e.response?.data?.message||"Could not update task.")} };
  const visible=tasks.filter((task)=>filter==="all"||task.status===filter);
  return <main className="mx-auto max-w-5xl space-y-6 text-[var(--text-primary)]"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-purple-300">Your work</p><h1 className="mt-1 text-3xl font-bold">My tasks</h1><p className="mt-2 text-[var(--text-secondary)]">Track your assignments and update progress.</p></div><button onClick={load} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5"><RotateCw size={16}/>Refresh</button></header>
    <div className="flex flex-wrap gap-2">{[["all","All"],["todo","To do"],["in_progress","In progress"],["done","Completed"]].map(([value,label])=><button key={value} onClick={()=>setFilter(value)} className={`rounded-full px-4 py-2 text-sm ${filter===value?"bg-purple-600 text-white":"border border-white/10 text-[var(--text-secondary)] hover:bg-white/5"}`}>{label}{value==="all"?` (${tasks.length})`:``}</button>)}</div>
    {error&&<p role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-300">{error}</p>}
    {loading?<p className="py-12 text-center text-[var(--text-muted)]">Loading assignments…</p>:visible.length===0?<div className="rounded-2xl border border-dashed border-white/15 p-12 text-center"><ClipboardList className="mx-auto mb-3 text-purple-300"/><h2 className="font-semibold">Nothing here yet</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Your assigned work will appear here.</p></div>:<section className="space-y-3">{visible.map((task)=><article key={task.id} className="rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-lg font-semibold">{task.title}</h2>{task.description&&<p className="mt-2 whitespace-pre-wrap text-sm text-[var(--text-secondary)]">{task.description}</p>}<p className="mt-3 text-xs text-[var(--text-muted)]">{task.dueDate?`Due ${task.dueDate} · `:""}Created {new Date(task.createdAt).toLocaleDateString()}</p></div><select aria-label={`Update ${task.title} status`} value={task.status} onChange={(e)=>update(task,e.target.value)} className="rounded-lg border border-white/10 bg-[#211d2c] px-3 py-2 text-sm"><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Completed</option></select></div>{task.status==="done"&&<div className="mt-3 flex items-center gap-2 text-sm text-emerald-400"><Check size={16}/>Completed</div>}</article>)}</section>}
  </main>;
}
