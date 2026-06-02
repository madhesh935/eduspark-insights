import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ChevronRight, ArrowRight, CheckCircle2, AlertTriangle,
  Play, RotateCcw, Brain, Clock, BarChart3, ArrowUpRight, Bot,
  Lightbulb, Lock, Flame
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell,
  AreaChart, Area,
} from "recharts";
import { students } from "@/lib/mock-data";
import { detectRootCause, generateFeedback, generateLearningPath } from "@/lib/ai-engine";
import type { TopicMastery } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/student-results")({
  head: () => ({ meta: [{ title: "My Results — InsightEDU" }] }),
  component: StudentResultsPage,
});

const demoStudent = students.find(s => s.risk === "high") ?? students[0];

// ─── Static display data ────────────────────────────────────────────────────

const trendData = [
  { test: "Test 1", score: 52 },
  { test: "Test 2", score: 60 },
  { test: "Test 3", score: 68 },
  { test: "Test 4", score: 81 },
];

const projectionData = [
  { label: "Now",             score: 35 },
  { label: "After Recursion", score: 52 },
  { label: "After Trees",     score: 68 },
  { label: "Full Path",       score: 82 },
];

const gapSeverity = [
  { topic: "Recursion",           sev: "Critical", color: "text-destructive", bg: "bg-destructive" },
  { topic: "Trees",               sev: "High",     color: "text-orange-500",  bg: "bg-orange-500" },
  { topic: "Graphs",              sev: "Medium",   color: "text-warning",     bg: "bg-warning" },
  { topic: "Dynamic Programming", sev: "Medium",   color: "text-warning",     bg: "bg-warning" },
];

const roadmap = [
  { label: "Current State",      icon: "📍", current: true  },
  { label: "Recursion Recovery", icon: "🔄", current: false },
  { label: "Tree Mastery",       icon: "🌳", current: false },
  { label: "Graph Fundamentals", icon: "🔗", current: false },
  { label: "Advanced Graphs",    icon: "⚡", current: false },
  { label: "Assessment Retake",  icon: "📝", current: false },
  { label: "Mastery Achieved",   icon: "🏆", current: false },
];

const nextSteps = [
  { title: "Recursion Fundamentals",      detail: "45 min · Video + Notes", gain: "+12%", icon: "🎬", cta: "Start",    to: "/student-learning-path" },
  { title: "Practice Recursion Problems", detail: "15 Questions",            gain: "+8%",  icon: "📝", cta: "Practice", to: "/student-assessment"    },
  { title: "Trees Mini Test",             detail: "10 Questions",            gain: "+7%",  icon: "✅", cta: "Attempt",  to: "/student-assessment"    },
  { title: "Graphs Basics Video",         detail: "30 Minutes",              gain: "+5%",  icon: "🎬", cta: "Watch",    to: "/student-learning-path" },
];

// ─── Loading screen ────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center space-y-5 max-w-sm w-full">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-glow">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </motion.div>
        <div className="font-display text-xl font-bold">AI is analysing your results…</div>
        <div className="space-y-3">
          {[
            "Calculating topic mastery scores…",
            "Running root-cause detection…",
            "Generating personalised feedback…",
            "Preparing recommendations…",
          ].map((msg, i) => (
            <motion.div key={msg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.45 }}
              className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                className="h-2 w-2 rounded-full bg-primary shrink-0" />
              {msg}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Circular Score Ring ───────────────────────────────────────────────────

function ScoreRing({ value }: { value: number }) {
  const r      = 36;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color  = value >= 70 ? "#22c55e" : value >= 40 ? "hsl(222,90%,55%)" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg width="96" height="96" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
        <motion.circle
          cx="44" cy="44" r={r} fill="none"
          stroke={color}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="font-display font-bold text-xl leading-none" style={{ color }}>{value}%</span>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

function StudentResultsPage() {
  const [ready, setReady] = useState(false);
  const [topicMastery, setTopicMastery] = useState<TopicMastery[]>([]);

  useEffect(() => {
    const tm: TopicMastery[] = Object.entries(demoStudent.topicMastery).map(([topic, mastery]) => ({
      topic, mastery,
      correct:        Math.round(mastery / 20),
      total:          5,
      avgTime:        45,
      avgConfidence:  mastery > 70 ? 3.5 : mastery > 50 ? 2.5 : 1.5,
    }));
    setTopicMastery(tm);
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return <LoadingScreen />;

  // ── All derivations happen AFTER the loading guard ──────────────────────
  const rootCauseResult = detectRootCause(topicMastery);
  const feedback        = generateFeedback(demoStudent.name, topicMastery, rootCauseResult);

  const rootCause    = rootCauseResult.rootCause || "Recursion";
  const confidence   = rootCauseResult.confidence || 90;
  const strongTopics = (feedback.strengths  ?? []).slice(0, 4);
  const weakTopics   = (feedback.improvements ?? []).slice(0, 4);

  const chartData = topicMastery.map(t => ({
    topic:     t.topic.length > 9 ? t.topic.slice(0, 8) + "…" : t.topic,
    fullTopic: t.topic,
    mastery:   t.mastery,
  }));

  const score = demoStudent.performance;

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-8">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow shrink-0">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">My Results & Analytics</h1>
              <p className="text-sm text-muted-foreground mt-1">Trees &amp; Graphs Quiz · AI analysis complete</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" className="gap-2"><RotateCcw className="h-4 w-4" /> Retake Quiz</Button>
            <Link to="/student-learning-path">
              <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
                <Play className="h-4 w-4" /> Start Learning Path
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── 4 KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Overall Score */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <GlassCard className="flex flex-col items-center text-center p-5 hover:border-primary/40 transition-all">
            <ScoreRing value={score} />
            <div className="mt-3 font-display font-bold text-sm leading-tight">Overall Score</div>
            <div className="mt-1 text-[10px] text-destructive font-bold bg-destructive/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Needs Improvement
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-success font-semibold">
              <ArrowUpRight className="h-3 w-3" /> +12% from previous
            </div>
          </GlassCard>
        </motion.div>

        {/* Strong Topics */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="flex flex-col p-5 h-full hover:border-success/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Strong Topics</div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/15">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
            </div>
            <div className="font-display text-4xl font-bold text-success">{strongTopics.length || 3}</div>
            <div className="mt-3 flex flex-col gap-1.5">
              {(strongTopics.length > 0 ? strongTopics : ["Arrays", "Stacks", "Hashing"]).map(t => (
                <div key={t} className="flex items-center gap-2 text-xs font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />{t}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Needs Work */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="flex flex-col p-5 h-full hover:border-destructive/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Needs Work</div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </div>
            <div className="font-display text-4xl font-bold text-destructive">{weakTopics.length || 4}</div>
            <div className="mt-3 flex flex-col gap-1.5">
              {(weakTopics.length > 0 ? weakTopics : ["Recursion", "Trees", "Graphs", "Dynamic Programming"]).map(t => (
                <div key={t} className="flex items-center gap-2 text-xs font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />{t}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Intelligence */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="flex flex-col p-5 h-full border-primary/20 bg-gradient-to-br from-primary/5 to-background hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Intelligence</div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className="font-bold text-primary">{confidence}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 1, delay: 0.5 }}
                    className="h-full gradient-primary rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Recovery Time</span>
                <span className="font-bold">5 Hours</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Expected Gain</span>
                <span className="font-bold text-success">+22%</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── 2-Column Main Layout ────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[7fr_3fr]">

        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Topic Mastery Bar Chart */}
          <GlassCard title="Topic Mastery Overview" description="Performance breakdown across all assessed topics"
            action={<Button variant="outline" size="sm" className="text-xs h-7 gap-1.5"><BarChart3 className="h-3 w-3"/>View All</Button>}>
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -20, right: 8, top: 20 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="topic" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const val = payload[0].value as number;
                    return (
                      <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-xs">
                        <div className="font-semibold">{(payload[0].payload as { fullTopic: string }).fullTopic}</div>
                        <div className={cn("mt-1 font-bold text-lg", val >= 70 ? "text-success" : val >= 40 ? "text-warning" : "text-destructive")}>{val}%</div>
                        <div className="text-muted-foreground">{val >= 70 ? "Strong" : val >= 40 ? "Average" : "Needs Attention"}</div>
                      </div>
                    );
                  }} />
                  <Bar dataKey="mastery" radius={[6, 6, 0, 0]} label={{ position: "top", fontSize: 10, fill: "var(--muted-foreground)" }}>
                    {chartData.map(entry => (
                      <Cell key={entry.topic}
                        fill={entry.mastery >= 70 ? "var(--success)" : entry.mastery >= 40 ? "hsl(38,92%,50%)" : "var(--destructive)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success inline-block"/> Strong (≥70%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-yellow-500 inline-block"/> Average (40–69%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-destructive inline-block"/> Weak (&lt;40%)</span>
            </div>
          </GlassCard>

          {/* Performance Trend */}
          <GlassCard title="Performance Trend" description="Score progression across assessments this semester"
            action={<Badge className="bg-success/15 text-success border-success/30 text-[10px] uppercase font-bold">↑ +29% Overall</Badge>}>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-muted/40 p-3 text-center">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Score</div>
                <div className="font-display font-bold text-xl mt-0.5">65%</div>
              </div>
              <div className="rounded-xl bg-success/10 p-3 text-center border border-success/20">
                <div className="text-[10px] font-bold text-success uppercase tracking-wider">Best Score</div>
                <div className="font-display font-bold text-xl text-success mt-0.5">81%</div>
              </div>
              <div className="rounded-xl bg-primary/10 p-3 text-center border border-primary/20">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Consistency</div>
                <div className="font-display font-bold text-xl text-primary mt-0.5">High</div>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="grad-trend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(222,90%,55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(222,90%,55%)" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="test" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[40, 100]} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, "Score"]} />
                  <Area type="monotone" dataKey="score" stroke="hsl(222,90%,55%)" strokeWidth={2.5}
                    fill="url(#grad-trend)"
                    dot={{ fill: "hsl(222,90%,55%)", r: 5, strokeWidth: 2, stroke: "var(--background)" }}
                    activeDot={{ r: 7 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Question Performance Summary */}
          <GlassCard title="Question Performance Summary" description="Breakdown of your latest quiz attempt">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Total Questions",   value: "20",  icon: BarChart3,   bg: "bg-primary/10",     fg: "text-primary"     },
                { label: "Correct Answers",   value: "7",   icon: CheckCircle2,bg: "bg-success/10",     fg: "text-success"     },
                { label: "Incorrect",         value: "11",  icon: AlertTriangle,bg:"bg-destructive/10",  fg: "text-destructive" },
                { label: "Skipped",           value: "2",   icon: AlertTriangle,bg:"bg-warning/10",      fg: "text-warning"     },
                { label: "Time Taken",        value: "24m", icon: Clock,       bg: "bg-muted",          fg: "text-foreground"  },
                { label: "Conf. Accuracy",    value: "62%", icon: Brain,       bg: "bg-primary/10",     fg: "text-primary"     },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-3 hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shrink-0", s.bg)}>
                    <s.icon className={cn("h-4 w-4", s.fg)} />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg leading-none">{s.value}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* AI Score Projection */}
          <GlassCard title="AI Score Projection" description="Estimated score after completing each module"
            action={<Sparkles className="h-4 w-4 text-primary" />}>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="grad-proj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--success)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[20, 100]} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, "Projected"]} />
                  <Area type="monotone" dataKey="score" stroke="var(--success)" strokeWidth={2.5} strokeDasharray="6 3"
                    fill="url(#grad-proj)"
                    dot={{ fill: "var(--success)", r: 5, strokeWidth: 2, stroke: "var(--background)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-muted-foreground">Now: <strong className="text-destructive">35%</strong></span>
              <span className="text-muted-foreground">After Full Path: <strong className="text-success">82%</strong></span>
            </div>
          </GlassCard>

        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex flex-col gap-6">

            {/* Root Cause Detection */}
            <div className="rounded-3xl border-2 border-destructive/25 bg-gradient-to-b from-destructive/8 to-background p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20 shrink-0">
                  <Brain className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm">Root Cause Detection</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Knowledge Graph</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 py-2 relative">
                <div className="absolute top-8 bottom-8 w-0.5 bg-gradient-to-b from-success via-destructive to-muted/40 left-1/2 -translate-x-px" />
                {[
                  { name: "Functions", icon: <CheckCircle2 className="h-4 w-4"/>, cls: "border-success bg-success/15 text-success",                               badge: <Badge className="bg-success/20 text-success border-none text-[9px]">✓ Done</Badge>        },
                  { name: rootCause,   icon: <AlertTriangle className="h-4 w-4"/>, cls: "border-destructive bg-destructive/15 text-destructive shadow-[0_0_12px_rgba(239,68,68,0.2)]", badge: <Badge className="bg-destructive/20 text-destructive border-none text-[9px] animate-pulse">Root</Badge> },
                  { name: "Trees",     icon: <Lock className="h-4 w-4"/>,          cls: "border-border bg-muted/30 text-muted-foreground",                           badge: <Badge variant="secondary" className="text-[9px]">Locked</Badge>                        },
                  { name: "Graphs",    icon: <Lock className="h-4 w-4"/>,          cls: "border-border bg-muted/30 text-muted-foreground",                           badge: <Badge variant="secondary" className="text-[9px]">Locked</Badge>                        },
                ].map((node, i) => (
                  <div key={node.name} className="relative z-10 w-full">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 + i * 0.15 }}
                      className={cn("flex items-center gap-2 rounded-xl border-2 px-3 py-2 font-semibold text-sm mx-4", node.cls)}>
                      {node.icon}
                      <span className="flex-1">{node.name}</span>
                      {node.badge}
                    </motion.div>
                    {i < 3 && (
                      <div className="flex justify-center my-1 text-muted-foreground opacity-40">
                        <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-center">
                <div className="rounded-xl bg-background/60 p-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Confidence</div>
                  <div className="font-bold text-primary text-sm">{confidence}%</div>
                </div>
                <div className="rounded-xl bg-background/60 p-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Impact</div>
                  <div className="font-bold text-destructive text-sm">3 Topics</div>
                </div>
                <div className="rounded-xl bg-background/60 p-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Recovery</div>
                  <div className="font-bold text-success text-sm">5 Hrs</div>
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            <GlassCard className="border-primary/25 bg-gradient-to-b from-primary/5 to-background p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary shadow-glow shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm">AI Personalised Feedback</div>
                  <div className="flex items-center gap-1 text-[10px] text-primary uppercase tracking-wider font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />Live Analysis
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {feedback.summary?.trim()
                  ? feedback.summary
                  : `${demoStudent.name.split(" ")[0]}, you have strong foundations in Arrays and Stacks. However, weaknesses in ${rootCause} are causing difficulties in Trees and Graphs. Strengthening ${rootCause} will unlock multiple advanced concepts.`}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-success/10 border border-success/20 p-2 text-center">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Score Gain</div>
                  <div className="font-bold text-success">+15%</div>
                </div>
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-2 text-center">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Time Needed</div>
                  <div className="font-bold text-primary">{feedback.estimatedImprovementTime || "5 Hours"}</div>
                </div>
              </div>
            </GlassCard>

            {/* Next Steps */}
            <GlassCard title="Recommended Next Steps" action={<Lightbulb className="h-4 w-4 text-warning" />} className="p-5">
              <div className="space-y-2.5">
                {nextSteps.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                    className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/30 p-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <span className="text-xl shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs leading-snug">{s.title}</div>
                      <div className="text-[10px] text-muted-foreground">{s.detail}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge className="bg-success/10 text-success border-none text-[9px] uppercase">{s.gain}</Badge>
                      <Link to={s.to}>
                        <Button size="sm" className="h-6 text-[10px] px-2 gradient-primary text-primary-foreground">{s.cta}</Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Learning Gap Severity */}
            <GlassCard title="Gap Severity Tracker" action={<AlertTriangle className="h-4 w-4 text-destructive" />} className="p-5">
              <div className="space-y-3">
                {gapSeverity.map((g, i) => (
                  <motion.div key={g.topic} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex items-center gap-3">
                    <div className={cn("h-2 w-2 rounded-full shrink-0", g.bg)} />
                    <span className="flex-1 text-sm font-medium">{g.topic}</span>
                    <span className={cn("text-xs font-bold", g.color)}>{g.sev}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>


          </div>
        </div>
      </div>
    </div>
  );
}
