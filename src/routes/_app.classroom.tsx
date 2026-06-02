import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity, Smile, Meh, Frown, Users, Hand, MessageSquare, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { classroomLive, students, classes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/classroom")({
  head: () => ({ meta: [{ title: "Live Classroom — InsightEDU" }] }),
  component: ClassroomPage,
});

// Seed a live engagement timeline
const makeTimeline = () =>
  Array.from({ length: 8 }, (_, i) => ({
    t: `${i * 3}m`,
    engagement: 62 + Math.round(Math.sin(i * 0.7) * 10 + Math.random() * 6),
    understanding: 58 + Math.round(Math.sin(i * 0.5 + 1) * 12 + Math.random() * 5),
  }));

const liveQuestions = [
  { id: 1, student: "Rohan Singh",    q: "Why does DFS use a stack instead of a queue?",           time: "2m ago", answered: true },
  { id: 2, student: "Priya Kapoor",   q: "Can we have a disconnected graph in BFS?",               time: "5m ago", answered: false },
  { id: 3, student: "Kabir Nair",     q: "What is the time complexity of BFS on a weighted graph?",time: "8m ago", answered: true },
  { id: 4, student: "Diya Mehta",     q: "Is BFS always optimal for shortest path?",              time: "11m ago",answered: false },
];

const quickPollData = [
  { name: "Fully understood", value: classroomLive.understood, color: "var(--success)" },
  { name: "Partially clear",  value: classroomLive.partial,    color: "var(--warning)" },
  { name: "Still confused",   value: classroomLive.confused,   color: "var(--destructive)" },
];

type UndStatus = "understood" | "partial" | "confused" | "away";

function ClassroomPage() {
  const [engagement, setEngagement] = useState(classroomLive.engagement);
  const [participation, setParticipation] = useState(classroomLive.participation);
  const [timeline, setTimeline] = useState(makeTimeline());
  const [elapsed, setElapsed] = useState(24);
  const [questions, setQuestions] = useState(liveQuestions);

  // Animate live values
  useEffect(() => {
    const t = setInterval(() => {
      const newE = Math.max(45, Math.min(96, engagement + (Math.random() * 6 - 3)));
      const newP = Math.max(40, Math.min(90, participation + (Math.random() * 5 - 2.5)));
      setEngagement(newE);
      setParticipation(newP);
      setElapsed(v => v + 1);
      setTimeline(prev => {
        const next = [...prev.slice(1), {
          t: `${elapsed + 1}m`,
          engagement: Math.round(newE),
          understanding: Math.round(newP - 4 + Math.random() * 8),
        }];
        return next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, [engagement, participation, elapsed]);

  // Generate 32 student seats from class c1
  const classStudents = students.filter(s => s.classId === "c1").slice(0, 32);
  const seatStatuses: UndStatus[] = classStudents.map(s =>
    s.risk === "high" ? "confused" : s.risk === "medium" ? "partial" : "understood"
  );

  const statusMeta: Record<UndStatus, { color: string; label: string; icon: React.ReactNode }> = {
    understood: { color: "bg-success", label: "Understood", icon: <CheckCircle2 className="h-3 w-3" /> },
    partial:    { color: "bg-warning",     label: "Partial",     icon: <Meh className="h-3 w-3" /> },
    confused:   { color: "bg-destructive", label: "Confused",    icon: <AlertCircle className="h-3 w-3" /> },
    away:       { color: "bg-muted-foreground/30", label: "Away", icon: null },
  };

  const cls = classes.find(c => c.id === "c1");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Live Classroom</h1>
          <p className="text-sm text-muted-foreground">Real-time engagement &amp; comprehension for <span className="font-medium text-foreground">{cls?.name}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-success/15 text-success ring-1 ring-success/30 gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
          </Badge>
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold">{elapsed}m</span>
            <span className="text-muted-foreground text-xs">elapsed</span>
          </div>
        </div>
      </div>

      {/* Session info bar */}
      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Now teaching</div>
            <div className="font-display text-xl font-bold mt-0.5">{classroomLive.topic}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Students",    value: classStudents.length },
              { label: "Engaged",     value: `${Math.round(engagement)}%` },
              { label: "Questions",   value: questions.length },
              { label: "Class",       value: cls?.name ?? "DS-11A" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="font-bold text-sm mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Live metrics row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Engagement gauge */}
        <GlassCard title="Engagement" description="Live signal · updates every 2s" action={<Activity className="h-4 w-4 text-primary" />}>
          <div className="text-center">
            <motion.div key={Math.round(engagement)} initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="font-display text-5xl font-bold text-gradient">
              {Math.round(engagement)}%
            </motion.div>
            <div className="mt-2 text-xs text-muted-foreground">↑ from 72% at lesson start</div>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div animate={{ width: `${engagement}%` }} transition={{ type: "spring", stiffness: 80 }}
                className="h-full gradient-primary" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-success/10 px-2 py-1"><div className="font-bold text-success">{Math.round(engagement * 0.55)}%</div><div className="text-muted-foreground">High</div></div>
              <div className="rounded-lg bg-warning/10 px-2 py-1"><div className="font-bold text-warning">{Math.round(engagement * 0.3)}%</div><div className="text-muted-foreground">Med</div></div>
              <div className="rounded-lg bg-destructive/10 px-2 py-1"><div className="font-bold text-destructive">{Math.round(engagement * 0.15)}%</div><div className="text-muted-foreground">Low</div></div>
            </div>
          </div>
        </GlassCard>

        {/* Participation */}
        <GlassCard title="Participation" description="Hands raised / active responses" action={<Hand className="h-4 w-4 text-warning" />}>
          <div className="text-center">
            <motion.div key={Math.round(participation)} initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="font-display text-5xl font-bold text-warning">
              {Math.round(participation)}%
            </motion.div>
            <div className="mt-2 text-xs text-muted-foreground">{questions.length} questions asked · {questions.filter(q=>q.answered).length} answered</div>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div animate={{ width: `${participation}%` }} transition={{ type: "spring", stiffness: 80 }}
                className="h-full bg-warning" />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {questions.slice(0,2).map(q => (
              <div key={q.id} className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0 truncate">{q.q}</div>
                {q.answered && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Class mood */}
        <GlassCard title="Class Mood" description="Sentiment analysis" action={<Users className="h-4 w-4 text-primary" />}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-success/10 p-3"><Smile className="mx-auto h-6 w-6 text-success" /><div className="mt-1 font-bold">65%</div><div className="text-[10px] text-muted-foreground">Confident</div></div>
            <div className="rounded-xl bg-warning/10 p-3"><Meh className="mx-auto h-6 w-6 text-warning" /><div className="mt-1 font-bold">22%</div><div className="text-[10px] text-muted-foreground">Unsure</div></div>
            <div className="rounded-xl bg-destructive/10 p-3"><Frown className="mx-auto h-6 w-6 text-destructive" /><div className="mt-1 font-bold">13%</div><div className="text-[10px] text-muted-foreground">Lost</div></div>
          </div>
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI Suggestion
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              4 students appear confused. Consider pausing to revisit BFS vs DFS distinction before continuing.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Engagement timeline */}
      <GlassCard title="Engagement Over Time" description="Live tracking — updates every 2 seconds">
        <div className="h-48">
          <ResponsiveContainer>
            <AreaChart data={timeline} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--success)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[40,100]} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="engagement" name="Engagement" stroke="var(--primary)" fill="url(#eg)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="understanding" name="Understanding" stroke="var(--success)" fill="url(#ug)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Seat grid + Poll */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Live seat grid */}
        <GlassCard className="lg:col-span-2" title="Live Seat Map" description={`${classStudents.length} students · colour = comprehension`}>
          <div className="grid grid-cols-8 gap-2">
            {classStudents.map((s, i) => {
              const status = seatStatuses[i];
              const meta = statusMeta[status];
              return (
                <motion.div key={s.id} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.015 }}
                  title={`${s.name} — ${meta.label}`}
                  className={cn("h-8 w-full rounded-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110", meta.color)}>
                  <span className="text-[9px] font-bold text-white">{s.name.split(" ")[0][0]}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {(Object.entries(statusMeta) as [UndStatus, typeof statusMeta[UndStatus]][])
              .filter(([k]) => k !== "away")
              .map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5 text-xs">
                  <div className={cn("h-2.5 w-2.5 rounded-full", v.color)} />
                  <span className="text-muted-foreground">{v.label} ({seatStatuses.filter(s => s === k).length})</span>
                </div>
              ))}
          </div>
        </GlassCard>

        {/* Live poll */}
        <GlassCard title="Comprehension Poll" description="Polled every 60 seconds">
          <div className="h-52">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={quickPollData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {quickPollData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground mt-2">Re-poll class now</Button>
        </GlassCard>
      </div>

      {/* Q&A feed */}
      <GlassCard title="Student Questions Feed" description="Live questions from the session" action={<MessageSquare className="h-4 w-4 text-primary" />}>
        <div className="space-y-3">
          <AnimatePresence>
            {questions.map((q, i) => (
              <motion.div key={q.id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                className={cn("flex items-start gap-3 rounded-2xl border p-4 transition",
                  q.answered ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"
                )}>
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  q.answered ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                )}>
                  {q.student.split(" ")[0][0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{q.student}</span>
                    <span className="text-xs text-muted-foreground">{q.time}</span>
                    {q.answered
                      ? <Badge className="bg-success/10 text-success text-[10px] gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> Answered</Badge>
                      : <Badge className="bg-warning/10 text-warning text-[10px]">Pending</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{q.q}</p>
                </div>
                {!q.answered && (
                  <Button size="sm" variant="outline" className="shrink-0" onClick={() => setQuestions(prev => prev.map(qq => qq.id === q.id ? {...qq, answered:true} : qq))}>
                    Mark answered
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
}
