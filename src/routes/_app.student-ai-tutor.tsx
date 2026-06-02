import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Plus, Bot, User, BookOpen, TrendingUp, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { students } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/student-ai-tutor")({
  head: () => ({ meta: [{ title: "AI Tutor — InsightEDU Student" }] }),
  component: StudentAITutor,
});

type Msg = { id: number; role: "user" | "ai"; text: string };

const myStudent = students.find((s) => s.risk === "high") ?? students[0];

const suggestions = [
  "Explain Recursion with a simple example",
  "Why is Binary Search O(log n)?",
  "Help me understand Tree Traversal",
  "What's the difference between BFS and DFS?",
  "Why am I struggling with Graphs?",
  "Give me practice problems on Recursion",
];

const conversations = [
  { id: 1, title: "Trees vs Graphs", time: "Today" },
  { id: 2, title: "Dynamic Programming basics", time: "Yesterday" },
  { id: 3, title: "Why use a Heap?", time: "2d ago" },
  { id: 4, title: "Recursion base cases", time: "3d ago" },
];

const aiResponses: Record<string, string> = {
  default: "Great question! Based on your learning history, I've tailored this explanation for you.\n\nYou've already mastered Arrays and Linked Lists, so we can build on that foundation. Want me to generate practice problems after this explanation?",
  recursion: "Recursion is when a function calls itself with a smaller subproblem until it hits a base case.\n\n**Simple Example — Factorial:**\n```\nfactorial(5) = 5 × factorial(4)\nfactorial(4) = 4 × factorial(3)\n...until factorial(1) = 1  ← base case\n```\n\n⚠️ **Your AI analysis shows Recursion is your root cause gap.** Mastering this will unlock Trees and Graphs for you!\n\nWant me to give you 3 warm-up problems?",
  graphs: "Since your AI analysis flagged Graphs as a weak topic, let me connect it to what you already know:\n\n**Recursion → Trees → Graphs** is the dependency chain.\n\nA Graph is just a generalization of a Tree — it can have cycles and multiple paths. BFS uses a Queue, DFS uses recursion (which is your focus area right now!).\n\nLet's build your confidence in Recursion first, then Graphs will feel natural. Ready?",
  bfs: "BFS (Breadth-First Search) explores level by level using a **Queue**.\nDFS (Depth-First Search) goes deep first using **Recursion** or a Stack.\n\nBFS → Queue → Level order\nDFS → Recursion → Preorder/Inorder/Postorder\n\nSince you're currently working on Recursion in your learning path, DFS will be your first graph algorithm to master!",
};

function getResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("recursion") || lower.includes("recursive")) return aiResponses.recursion;
  if (lower.includes("graph") || lower.includes("struggling")) return aiResponses.graphs;
  if (lower.includes("bfs") || lower.includes("dfs")) return aiResponses.bfs;
  return aiResponses.default;
}

function StudentAITutor() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1, role: "ai",
      text: `Hi ${myStudent.name.split(" ")[0]}! 👋 I'm your personal AI tutor.\n\nBased on your recent results, I know you're working on **${myStudent.rootCause || "Recursion"}** fundamentals. Let's tackle it together!\n\nAsk me anything, or pick a suggestion below.`,
    },
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
      setMessages((m) => [...m, { id: id + 1, role: "ai", text: getResponse(text) }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Student context bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Personalised to your learning gaps</span>
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          {myStudent.weakTopics.slice(0, 2).map((t) => (
            <Badge key={t} className="bg-destructive/10 text-destructive text-[10px] gap-1">
              <AlertTriangle className="h-2.5 w-2.5" /> Focus: {t}
            </Badge>
          ))}
          {myStudent.rootCause && (
            <Badge className="bg-warning/10 text-warning text-[10px]">
              Root: {myStudent.rootCause}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid h-[calc(100vh-14rem)] gap-4 lg:grid-cols-[260px_1fr]">
        {/* Sidebar — conversations */}
        <GlassCard className="hidden lg:flex lg:flex-col" style={{ padding: 0 }}>
          <div className="border-b border-border p-3">
            <Button size="sm" className="w-full gradient-primary text-primary-foreground gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New chat
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {conversations.map((c) => (
              <button key={c.id} className="block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-accent">
                <div className="font-medium truncate">{c.title}</div>
                <div className="text-[10px] text-muted-foreground">{c.time}</div>
              </button>
            ))}
          </div>
          {/* My learning context */}
          <div className="border-t border-border p-3 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">My Learning Context</div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-muted-foreground">Strong: Arrays, Linked Lists</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-muted-foreground">Focus: {myStudent.rootCause || "Recursion"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">Path step 1/{myStudent.learningPath.length}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Chat window */}
        <GlassCard className="flex flex-col overflow-hidden" style={{ padding: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-sm">InsightEDU AI Tutor</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse inline-block" />
                Aware of your learning path · Personalised for {myStudent.name.split(" ")[0]}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={ref} className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm",
                    m.role === "ai" ? "gradient-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {m.role === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={cn("max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "ai" ? "bg-muted" : "gradient-primary text-primary-foreground"
                  )}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="border-t border-border p-3">
              <div className="mb-2 text-xs font-medium text-muted-foreground">Suggested questions</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary/40 hover:bg-accent transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border p-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the tutor anything about your coursework…" />
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
