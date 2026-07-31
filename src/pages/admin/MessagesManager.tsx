import { useEffect, useState } from "react";
import { api } from "@/src/services/api";
import { Mail, Trash2, Check, X, ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { toastSuccess, toastError, confirmDelete } from "@/src/lib/alerts";

export default function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setMessages(await api.getMessages()); } catch {} finally { setLoading(false); }
  };

  const markRead = async (id: string) => {
    try {
      await api.markMessageRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
      toastSuccess("Marked as read");
    } catch { toastError("Failed to update"); }
  };

  const remove = async (id: string) => {
    if (!await confirmDelete("this message")) return;
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toastSuccess("Message deleted");
    } catch { toastError("Failed to delete"); }
  };

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-5 lg:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-3xl font-black tracking-tighter uppercase text-foreground">Messages</h1>
          <p className="text-[9px] lg:text-[10px] text-muted-foreground font-medium mt-0.5 lg:mt-1 tracking-wide">
            {messages.length} total{unread > 0 ? `, ${unread} unread` : ""}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse border border-border/40" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="border border-border/50 p-8 lg:p-12 text-center">
          <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4 border border-border flex items-center justify-center">
            <Inbox className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
          </div>
          <p className="text-xs lg:text-sm font-bold text-muted-foreground">No messages yet</p>
          <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-1">Incoming contact form submissions will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`border ${msg.is_read ? "border-border/30" : "border-primary/20 bg-primary/[0.02]"} bg-card transition-all`}>
              <button
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                className="w-full flex items-center justify-between px-3 lg:px-5 py-3 lg:py-4 gap-3 text-left"
              >
                <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${msg.is_read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                  <div className="min-w-0">
                    <p className={`text-xs lg:text-sm truncate ${msg.is_read ? "text-muted-foreground" : "text-foreground font-bold"}`}>
                      {msg.name}
                    </p>
                    <p className="text-[9px] lg:text-[10px] text-muted-foreground truncate mt-0.5">
                      {msg.subject || "No subject"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                  <span className="text-[8px] lg:text-[9px] text-muted-foreground font-mono whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {expanded === msg.id ? <ChevronUp className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />}
                </div>
              </button>

              {expanded === msg.id && (
                <div className="px-3 lg:px-5 pb-4 lg:pb-5 border-t border-border/30 pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Email</p>
                      <p className="text-xs lg:text-sm text-foreground">{msg.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Subject</p>
                      <p className="text-xs lg:text-sm text-foreground">{msg.subject || "—"}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Message</p>
                    <p className="text-xs lg:text-sm text-foreground whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    {!msg.is_read && (
                      <button onClick={() => markRead(msg.id)}
                        className="h-8 px-4 border border-border text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-1.5">
                        <Check className="h-3 w-3" /> Mark Read
                      </button>
                    )}
                    <button onClick={() => remove(msg.id)}
                      className="h-8 px-4 border border-border text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5 transition-all flex items-center gap-1.5">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                    <span className="text-[8px] lg:text-[9px] text-muted-foreground font-mono ml-auto">
                      {new Date(msg.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
