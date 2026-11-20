import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Search, Send } from "lucide-react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../../config/axiosInstance";

export default function Chat() {
  const { employee } = useSelector((state) => state.auth);
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const bottom = useRef(null);

  useEffect(() => {
    axiosInstance.get("/chat/people").then(({ data }) => {
      setPeople(data.data);
      if (data.data.length) setSelected(data.data[0]);
    }).catch((e) => setError(e.response?.data?.message || "Could not load coworkers."))
      .finally(() => setLoading(false));
  }, []);

  const loadMessages = useCallback(async (initial = false) => {
    if (!selected) return;
    try {
      const after = initial ? 0 : (messagesRef.current.at(-1)?.sequence || 0);
      const { data } = await axiosInstance.get(`/chat/messages?with=${encodeURIComponent(selected._id)}&after=${after}`);
      if (initial) setMessages(data.data);
      else if (data.data.length) setMessages((current) => [...current, ...data.data]);
      setError("");
    } catch (e) { setError(e.response?.data?.message || "Could not load messages."); }
  }, [selected]);
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => {
    setMessages([]);
    if (!selected) return undefined;
    loadMessages(true);
    const timer = window.setInterval(() => loadMessages(false), 2500);
    return () => window.clearInterval(timer);
  }, [selected, loadMessages]);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || !selected) return;
    setText("");
    try {
      const { data } = await axiosInstance.post("/chat/messages", { receiverId: selected._id, text: value });
      setMessages((current) => current.some((item) => item.id === data.data.id) ? current : [...current, data.data]);
      setError("");
    } catch (e) { setText(value); setError(e.response?.data?.message || "Message could not be sent."); }
  };

  const visiblePeople = people.filter((person) => `${person.name} ${person.department}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <section className="h-[calc(100vh-7rem)] min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#15121d] text-white shadow-xl">
      <header className="border-b border-white/10 px-6 py-5"><h1 className="text-2xl font-bold">Team chat</h1><p className="mt-1 text-sm text-gray-400">Private conversations with active coworkers</p></header>
      <div className="grid h-[calc(100%-5.25rem)] grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-white/10 md:block">
          <label className="m-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3"><Search size={16} className="text-gray-400"/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Find coworkers" className="h-11 w-full bg-transparent text-sm outline-none"/></label>
          <div className="overflow-y-auto">{loading ? <p className="p-4 text-sm text-gray-400">Loading coworkers…</p> : visiblePeople.map((person)=><button key={person._id} onClick={()=>setSelected(person)} className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/5 ${selected?._id===person._id?"bg-purple-500/15":""}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-purple-600 font-semibold">{person.name.split(" ").map((part)=>part[0]).slice(0,2).join("")}</span><span className="min-w-0"><span className="block truncate font-medium">{person.name}</span><span className="block truncate text-xs capitalize text-gray-400">{person.department}</span></span></button>)}</div>
          {!loading && visiblePeople.length===0&&<p className="px-4 text-sm text-gray-400">No active coworkers found.</p>}
        </aside>
        <div className="flex min-h-0 flex-col">
          {selected ? <><div className="flex items-center gap-3 border-b border-white/10 px-5 py-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-purple-600 font-semibold">{selected.name.split(" ").map((part)=>part[0]).slice(0,2).join("")}</span><div><h2 className="font-semibold">{selected.name}</h2><p className="text-xs capitalize text-gray-400">{selected.department} · active</p></div><select aria-label="Choose coworker" value={selected._id} onChange={(e)=>setSelected(people.find((p)=>p._id===e.target.value))} className="ml-auto max-w-40 rounded-lg border border-white/10 bg-[#211d2c] px-2 py-2 text-sm md:hidden">{people.map((p)=><option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 md:px-6">{messages.length===0?<div className="grid h-full place-items-center text-center text-gray-400"><div><MessageCircle className="mx-auto mb-3"/><p>Start a conversation with {selected.name}.</p></div></div>:messages.map((message)=><div key={message.id} className={`flex ${message.senderId===employee?._id?"justify-end":"justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 ${message.senderId===employee?._id?"bg-purple-600":"bg-white/10"}`}><p className="whitespace-pre-wrap break-words text-sm">{message.text}</p><time className="mt-1 block text-right text-[10px] text-white/60">{new Date(message.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</time></div></div>)}<div ref={bottom}/></div>
            {error&&<p role="alert" className="px-5 pb-2 text-sm text-red-300">{error}</p>}
            <form onSubmit={sendMessage} className="flex gap-3 border-t border-white/10 p-4"><input value={text} onChange={(e)=>setText(e.target.value)} maxLength={2000} placeholder={`Message ${selected.name}…`} className="h-12 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 outline-none focus:border-purple-500"/><button disabled={!text.trim()} aria-label="Send message" className="grid h-12 w-12 place-items-center rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40"><Send size={18}/></button></form>
          </> : <div className="grid flex-1 place-items-center text-gray-400">{loading?"Loading coworkers…":"No active coworkers are available."}</div>}
        </div>
      </div>
    </section>
  );
}
