import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Plus, Bot, User } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/ai-tutor")({
  head: () => ({ meta: [{ title: "AI Tutor — InsightEDU" }] }),
  component: AITutor,
});

type Msg = { id: number; role: "user" | "ai"; text: string };

const suggestions = [
  "Explain Recursion with a simple example",
  "Why is Binary Search O(log n)?",
  "Help me solve Graph Traversal problems",
  "What's the difference between BFS and DFS?",
];

const conversations = [
  { id: 1, title: "Trees vs Graphs", time: "Today" },
  { id: 2, title: "Dynamic Programming basics", time: "Yesterday" },
  { id: 3, title: "Why use a Heap?", time: "2d ago" },
];

function AITutor() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, role: "ai", text: "Hi! I'm your AI tutor. Ask me anything about your coursework — or tap a suggestion below." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, {
        id: id + 1, role: "ai",
        text: `Great question! Let me break that down step by step.\n\n${text.includes("Recursion") ? "Recursion is when a function calls itself with a smaller subproblem until reaching a base case. For example, factorial(n) = n × factorial(n-1)." : "Here's a clean explanation tailored to your learning history. You've already mastered the prerequisite concepts, so this should click quickly."}\n\nWant me to generate practice problems?`,
      }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[260px_1fr]">
      <GlassCard className="hidden lg:flex lg:flex-col p-0!">
        <div className="border-b border-border p-3">
          <Button size="sm" className="w-full gradient-primary text-primary-foreground"><Plus className="mr-1.5 h-3.5 w-3.5" />New chat</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {conversations.map((c) => (
            <button key={c.id} className="block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent">
              <div className="font-medium truncate">{c.title}</div>
              <div className="text-[10px] text-muted-foreground">{c.time}</div>
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col overflow-hidden p-0!">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
          <div>
            <div className="font-semibold text-sm">InsightEDU Tutor</div>
            <div className="text-[10px] text-muted-foreground">Always learning with you</div>
          </div>
        </div>

        <div ref={ref} className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
              >
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  m.role === "ai" ? "gradient-primary text-primary-foreground" : "bg-muted")}>
                  {m.role === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={cn("max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                  m.role === "ai" ? "bg-muted" : "gradient-primary text-primary-foreground")}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground"><Bot className="h-4 w-4" /></div>
              <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
                ))}
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="border-t border-border p-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Try asking</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary/40 hover:bg-accent transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border p-3">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the tutor anything…" />
          <Button type="submit" className="gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
        </form>
      </GlassCard>
    </div>
  );
}
