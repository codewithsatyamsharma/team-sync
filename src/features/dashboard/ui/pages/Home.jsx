import { createElement, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ClipboardList, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../../config/axiosInstance";

const card = "rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-5";
export default function Home() {
  const { employee } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([axiosInstance.get("/tasks"), axiosInstance.get("/chat/people")])
      .then(([taskResponse, peopleResponse]) => { setTasks(taskResponse.data.data); setPeople(peopleResponse.data.data); })
      .catch((e) => setError(e.response?.data?.message || "Could not load your workspace summary."));
  }, []);
  const completed = tasks.filter((task) => task.status === "done").length;
  const open = tasks.length - completed;
  return <main className="space-y-6 text-[var(--text-primary)]">
    <header className="rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-600 p-7 text-white"><p className="text-sm text-white/75">Your workspace</p><h1 className="mt-1 text-3xl font-bold">Welcome back, {employee?.name?.split(" ")[0] || "there"}</h1><p className="mt-2 text-white/80">Here is what is happening with your team today.</p></header>
    {error && <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-300">{error}</p>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[[ClipboardList,"All tasks",tasks.length],[CheckCircle2,"Completed",completed],[Users,"Active coworkers",people.length],[MessageCircle,"Open tasks",open]].map(([Icon,title,value])=><article className={card} key={title}><div className="flex items-center justify-between text-sm text-[var(--text-secondary)]"><span>{title}</span>{createElement(Icon,{size:19})}</div><p className="mt-4 text-3xl font-bold">{value}</p></article>)}
    </section>
    <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <article className={card}><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Recent tasks</h2><Link className="flex items-center gap-1 text-sm text-purple-300" to={employee?.role === "admin" ? "/home/task" : "/home/myTask"}>View tasks <ArrowRight size={15}/></Link></div>
        {tasks.length===0?<p className="py-8 text-center text-sm text-[var(--text-muted)]">No tasks yet. {employee?.role==="admin"?"Create a task and assign it to a coworker.":"Your manager can assign work to you."}</p>:tasks.slice(0,5).map((task)=><div key={task.id} className="flex items-center justify-between border-t border-white/10 py-3"><div><p className="font-medium">{task.title}</p><p className="text-xs text-[var(--text-muted)]">{employee?.role==="admin"?`Assigned to ${task.assignee}`:task.dueDate?`Due ${task.dueDate}`:"Assigned to you"}</p></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize">{task.status.replace("_"," ")}</span></div>)}</article>
      <article className={card}><h2 className="mb-4 text-lg font-semibold">Quick links</h2><div className="grid gap-3"><Link to="/home/chat" className="flex items-center gap-3 rounded-xl border border-white/10 p-4 hover:bg-white/5"><MessageCircle size={19} className="text-purple-300"/><span><b className="block">Team chat</b><small className="text-[var(--text-muted)]">Talk with active coworkers</small></span><ArrowRight className="ml-auto" size={17}/></Link><Link to={employee?.role==="admin"?"/home/task":"/home/myTask"} className="flex items-center gap-3 rounded-xl border border-white/10 p-4 hover:bg-white/5"><ClipboardList size={19} className="text-purple-300"/><span><b className="block">{employee?.role==="admin"?"Manage tasks":"My tasks"}</b><small className="text-[var(--text-muted)]">{open} items need attention</small></span><ArrowRight className="ml-auto" size={17}/></Link><Link to={employee?.role==="admin"?"/home/employee":"/home/profile"} className="flex items-center gap-3 rounded-xl border border-white/10 p-4 hover:bg-white/5"><Users size={19} className="text-purple-300"/><span><b className="block">{employee?.role==="admin"?"Employee directory":"My profile"}</b><small className="text-[var(--text-muted)]">View workspace details</small></span><ArrowRight className="ml-auto" size={17}/></Link></div></article>
    </section>
  </main>;
}
