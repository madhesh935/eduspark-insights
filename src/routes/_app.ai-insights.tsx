import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Target, Lightbulb, ArrowRight, ChevronRight, TrendingUp,
  Users, Brain, AlertTriangle, CheckCircle2, Clock, BarChart3, Zap,
  BookOpen, RefreshCcw, Eye,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { learningLoopSteps, students, interventions, classes, subjectAnalytics } from "@/lib/mock-data";
import { predictRisk } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights — InsightEDU" }] }),
  component: AIInsightsPage,
});

// ─── Continuous Learning Loop ───────────────────────────────────
function LearningLoop() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => setActiveStep(v => (v + 1) % learningLoopSteps.length), 1800);
    return () => clearInterval(t);
  }, [isPlaying]);

  const descriptions: Record<number, string> = {
    1: "Teacher creates a 20-question quiz tagged with topic, subtopic, difficulty, and learning outcome.",
    2: "AI analyses all student responses including per-question confidence ratings (Very Confident → Guessing).",
    3: "Weak topics identified per student — e.g. 38 students struggling with Graphs (85% miss rate).",
    4: "AI traces the root cause using knowledge dependency tree: Recursion → Trees → Graphs.",
    5: "Personalized actions generated: watch video, complete practice set, retake mini-quiz.",
    6: "Teacher reviews and approves AI-suggested interventions with one click.",
    7: "Student follows their custom learning path with videos, problems, and mini-quizzes.",
    8: "Mini-assessment on previously weak topics to measure improvement.",
    9: "Mastery scores updated — average improvement from 38% to 75% in 1 week.",
  };

  const currentStep = learningLoopSteps[activeStep];
  return (
    <div className="space-y-5">
      <div className="relative">
        <div className="absolute top-7 left-7 right-7 h-0.5 bg-border hidden md:block" />
        <div className="absolute top-7 left-7 h-0.5 bg-primary hidden md:block transition-all duration-500"
          style={{ width: `calc(${(activeStep / (learningLoopSteps.length - 1)) * 100}% - 56px)` }} />
        <div className="flex items-start justify-between gap-1 overflow-x-auto pb-2 md:pb-0">
          {learningLoopSteps.map((step, i) => {
            const isPast = i < activeStep; const isActive = i === activeStep;
            return (
              <button key={step.id} onClick={() => { setActiveStep(i); setIsPlaying(false); }}
                className="flex flex-col items-center gap-2 min-w-[60px] md:min-w-0 flex-1 group">
                <motion.div animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                  className={cn("relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-xl transition-all z-10",
                    isActive ? "border-primary bg-primary shadow-glow" : isPast ? "border-success bg-success/20" : "border-border bg-background hover:border-primary/40"
                  )}>
                  {step.icon}
                  {isActive && <motion.span initial={{ scale:0 }} animate={{ scale:[1,1.5,1] }} transition={{ repeat:Infinity, duration:1.5 }}
                    className="absolute inset-0 rounded-2xl border-2 border-primary opacity-40" />}
                  {isPast && <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success flex items-center justify-center text-white text-[10px] font-bold">✓</div>}
                </motion.div>
                <div className={cn("text-center text-[9px] font-medium leading-tight max-w-[56px] transition-colors",
                  isActive ? "text-primary" : isPast ? "text-success" : "text-muted-foreground")}>
                  {step.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeStep} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-5">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">{currentStep?.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-lg">{currentStep?.label}</span>
                <Badge className="bg-primary/15 text-primary text-[10px]">Step {currentStep?.id} of {learningLoopSteps.length}</Badge>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{descriptions[currentStep?.id ?? 1]}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center gap-3">
        <button onClick={() => setIsPlaying(!isPlaying)}
          className={cn("flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition",
            isPlaying ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary")}>
          {isPlaying ? "⏸ Pause" : "▶ Auto-play"}
        </button>
        <div className="flex gap-1">
          {learningLoopSteps.map((_, i) => (
            <button key={i} onClick={() => { setActiveStep(i); setIsPlaying(false); }}
              className={cn("h-1.5 rounded-full transition-all", i===activeStep?"w-5 bg-primary":i<activeStep?"w-3 bg-success":"w-3 bg-muted")} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Risk Gauge ─────────────────────────────────────────────────
function RiskGauge({ score, level }: { score: number; level: "low"|"medium"|"high" }) {
  const color = level==="high"?"var(--destructive)":level==="medium"?"var(--warning)":"var(--success)";
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (score / 100) * circumference * 0.75;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="130" height="80" viewBox="0 0 130 80">
        <path d="M 15 75 A 52 52 0 0 1 115 75" fill="none" stroke="var(--muted)" strokeWidth="10" strokeLinecap="round" />
        <motion.path d="M 15 75 A 52 52 0 0 1 115 75" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75}`}
          initial={{ strokeDashoffset: circumference * 0.75 }} animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, type: "spring" }} />
        <text x="65" y="70" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">{score}</text>
      </svg>
      <div className={cn("text-xs font-bold uppercase tracking-wider",
        level==="high"?"text-destructive":level==="medium"?"text-warning":"text-success")}>{level} risk</div>
    </div>
  );
}

// ─── Topic Heatmap ──────────────────────────────────────────────
const heatTopics = [
  { topic: "Recursion",          mastery: 42, students: 38, trend: "down"  },
  { topic: "Trees",              mastery: 48, students: 31, trend: "down"  },
  { topic: "Graphs",             mastery: 35, students: 44, trend: "down"  },
  { topic: "Dynamic Programming",mastery: 51, students: 27, trend: "up"    },
  { topic: "Sorting",            mastery: 73, students: 12, trend: "up"    },
  { topic: "Hashing",            mastery: 69, students: 15, trend: "stable"},
  { topic: "Arrays",             mastery: 82, students: 6,  trend: "up"    },
  { topic: "Linked Lists",       mastery: 77, students: 9,  trend: "stable"},
];

// ─── Weekly class summaries ──────────────────────────────────────
const classSummaries = [
  { class: "Data Structures", avg: 62, improvement: +4, atRisk: 14, topGap: "Graphs", action: "Schedule Graphs revision", icon: "🌳" },
  { class: "Algorithms",      avg: 71, improvement: +7, atRisk: 8,  topGap: "DP",     action: "Assign DP practice set", icon: "⚡" },
  { class: "Web Development", avg: 78, improvement: +2, atRisk: 4,  topGap: "Async",  action: "Provide async/await demo", icon: "🌐" },
];

// ─── Model accuracy ─────────────────────────────────────────────
const modelAccuracy = [
  { week: "W1", accuracy: 78 }, { week: "W2", accuracy: 81 },
  { week: "W3", accuracy: 83 }, { week: "W4", accuracy: 85 },
  { week: "W5", accuracy: 87 }, { week: "W6", accuracy: 89 },
];

const radarSubjects = subjectAnalytics.slice(0, 6).map(s => ({ subject: s.subject.split(" ")[0], avg: s.avgScore }));

// ─── Main Page ───────────────────────────────────────────────────
function AIInsightsPage() {
  const atRiskStudents  = students.filter(s => s.risk !== "low").slice(0, 6);
  const pendingCount    = interventions.filter(i => i.status === "pending").length;
  const demoStudent     = students.find(s => s.risk === "high") ?? students[0];
  const riskPrediction  = predictRisk(demoStudent);
  const totalGaps       = students.reduce((a, s) => a + s.gaps, 0);
  const avgScore        = Math.round(students.reduce((a,s) => a+s.performance, 0) / students.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">AI Insights</h1>
          <p className="text-sm text-muted-foreground">
            Continuous learning loop · Root-cause detection · Risk prediction · Class summaries.
          </p>
        </div>
        <Link to="/teacher-interventions">
          <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
            <Lightbulb className="h-4 w-4" /> {pendingCount} Pending Interventions
          </Button>
        </Link>
      </div>

      {/* Stat overview */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="At-Risk Students"  value={students.filter(s=>s.risk==="high").length} icon={AlertTriangle} tone="destructive" index={0} subtitle="Flagged today" />
        <StatCard label="Learning Gaps"     value={totalGaps}                                   icon={Brain}         tone="warning"     index={1} subtitle="Across all classes" />
        <StatCard label="AI Interventions"  value={interventions.length}                        icon={Lightbulb}     tone="primary"     index={2} subtitle={`${pendingCount} pending`} />
        <StatCard label="Avg Class Score"   value={`${avgScore}%`}                              icon={TrendingUp}    tone="success"     index={3} subtitle="All 3 classes" />
      </div>

      {/* Continuous Learning Loop */}
      <GlassCard title="Continuous AI Learning Loop" description="9-step automated cycle — assessment to mastery" action={<Sparkles className="h-4 w-4 text-primary" />}>
        <LearningLoop />
      </GlassCard>

      {/* Root cause + Risk gauge */}
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard title="Root Cause Detection" description="Tracing learning gaps to their prerequisite origin" action={<Sparkles className="h-4 w-4 text-primary" />}>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <div className="text-xs uppercase tracking-wider text-destructive font-semibold">Most common weak topic this week</div>
            <div className="mt-1 font-display text-2xl font-bold">Graphs</div>
            <div className="mt-0.5 text-xs text-muted-foreground">38 students · 85% miss rate</div>
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Knowledge dependency chain</div>
              <div className="flex items-center gap-1 flex-wrap">
                {["Recursion","Trees","Graphs"].map((t, i) => (
                  <div key={t} className="flex items-center gap-1">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold",
                      i===0?"bg-destructive/15 text-destructive border border-destructive/30":
                      i===1?"bg-warning/15 text-warning border border-warning/30":
                      "bg-muted text-muted-foreground")}>{t}</span>
                    {i<2 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">AI confidence</span>
                <span className="font-semibold text-primary">92%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div initial={{ width:0 }} animate={{ width:"92%" }} transition={{ duration:0.8 }} className="h-full gradient-primary" />
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            {[{l:"Recursion",v:"42%",c:"text-destructive"},{l:"Trees",v:"38%",c:"text-warning"},{l:"Graphs",v:"35%",c:"text-destructive"}].map(t=>(
              <div key={t.l} className="rounded-xl bg-muted/50 p-2">
                <div className={cn("font-bold text-base",t.c)}>{t.v}</div>
                <div className="text-muted-foreground">{t.l}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="AI Risk Prediction" description={`Risk profile — ${demoStudent.name}`} action={<Target className="h-4 w-4 text-primary" />}>
          <div className="flex flex-col items-center">
            <RiskGauge score={riskPrediction.score} level={riskPrediction.level} />
          </div>
          <div className="mt-3 space-y-2">
            {riskPrediction.factors.map(f => (
              <div key={f.factor} className="flex items-center gap-2 text-sm">
                <div className={cn("h-2 w-2 rounded-full shrink-0", f.impact==="positive"?"bg-success":"bg-destructive")} />
                <span className="flex-1 text-muted-foreground text-xs">{f.factor}</span>
                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width:0 }} animate={{ width:`${f.weight}%` }}
                    className={cn("h-full rounded-full", f.impact==="positive"?"bg-success":"bg-destructive")} />
                </div>
                <span className={cn("text-xs font-semibold w-8 text-right", f.impact==="positive"?"text-success":"text-destructive")}>
                  {f.weight}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-muted/40 p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2">4-Week Score Forecast</div>
            <div className="flex items-end gap-2 h-12">
              {riskPrediction.forecast.map((score, i) => (
                <motion.div key={i} initial={{ height:0 }} animate={{ height:`${Math.round((score/100)*48)}px` }} transition={{ delay: i*0.1 }}
                  className="flex-1 rounded-t bg-primary/30" title={`Week ${i+1}: ${Math.round(score)}%`} />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
              {["W1","W2","W3","W4"].map(w=><span key={w}>{w}</span>)}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Topic heatmap + Subject radar */}
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard title="Topic Difficulty Heatmap" description="Student mastery across all topics — sorted by struggle">
          <div className="space-y-2.5">
            {heatTopics.sort((a,b)=>a.mastery-b.mastery).map((t, i) => (
              <motion.div key={t.topic} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.05 }}
                className="flex items-center gap-3">
                <div className="w-32 shrink-0 text-xs font-medium truncate">{t.topic}</div>
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width:0 }} animate={{ width:`${t.mastery}%` }} transition={{ duration:0.7, delay:i*0.05 }}
                    className={cn("h-full rounded-full",
                      t.mastery>=75?"bg-success":t.mastery>=55?"gradient-primary":t.mastery>=40?"bg-warning":"bg-destructive"
                    )} />
                </div>
                <div className={cn("text-xs font-bold w-8 text-right",
                  t.mastery>=75?"text-success":t.mastery>=55?"text-primary":t.mastery>=40?"text-warning":"text-destructive")}>
                  {t.mastery}%
                </div>
                <div className="text-[10px] text-muted-foreground w-16 text-right">{t.students} struggling</div>
                <span className={cn("text-xs",t.trend==="up"?"text-success":t.trend==="down"?"text-destructive":"text-muted-foreground")}>
                  {t.trend==="up"?"↑":t.trend==="down"?"↓":"→"}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Subject Performance Radar" description="Average mastery across subjects">
          <div className="h-56">
            <ResponsiveContainer>
              <RadarChart data={radarSubjects}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:"var(--muted-foreground)", fontSize:11 }} />
                <Radar name="Avg Score" dataKey="avg" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background:"var(--popover)", border:"1px solid var(--border)", borderRadius:12, fontSize:12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* AI Model accuracy trend */}
      <GlassCard title="AI Model Accuracy Trend" description="How accurately the AI predicted at-risk students over the past 6 weeks" action={<BarChart3 className="h-4 w-4 text-primary" />}>
        <div className="h-44">
          <ResponsiveContainer>
            <AreaChart data={modelAccuracy} margin={{ left:-20, right:8, top:8 }}>
              <defs>
                <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fill:"var(--muted-foreground)", fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70,100]} tick={{ fill:"var(--muted-foreground)", fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:"var(--popover)", border:"1px solid var(--border)", borderRadius:12, fontSize:12 }}
                formatter={(v:number) => [`${v}%`, "Accuracy"]} />
              <Area type="monotone" dataKey="accuracy" stroke="var(--primary)" fill="url(#acc)" strokeWidth={3} dot={{ r:4, fill:"var(--primary)" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
          {[
            { label:"Current Accuracy", value:"89%", color:"text-success" },
            { label:"Predictions Made", value:"1,240", color:"text-primary" },
            { label:"False Positives",  value:"4.2%", color:"text-warning" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-muted/40 p-2">
              <div className={cn("font-bold text-base",s.color)}>{s.value}</div>
              <div className="text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Weekly class AI summaries */}
      <GlassCard title="Weekly AI Class Summaries" description="Auto-generated per-class digest — updated every Monday" action={<Zap className="h-4 w-4 text-warning" />}>
        <div className="grid gap-4 md:grid-cols-3">
          {classSummaries.map((c, i) => (
            <motion.div key={c.class} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
              className="rounded-2xl border border-border/60 bg-muted/20 p-4 hover:border-primary/30 hover:bg-primary/5 transition">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-semibold text-sm">{c.class}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/60 p-1.5 text-center">
                  <div className="font-bold">{c.avg}%</div>
                  <div className="text-muted-foreground">Avg</div>
                </div>
                <div className="rounded-lg bg-muted/60 p-1.5 text-center">
                  <div className={cn("font-bold", c.improvement>0?"text-success":"text-destructive")}>+{c.improvement}%</div>
                  <div className="text-muted-foreground">Growth</div>
                </div>
              </div>
              <div className="mt-3 text-xs">
                <span className="text-muted-foreground">Top gap: </span>
                <span className="font-semibold text-warning">{c.topGap}</span>
                <span className="text-muted-foreground"> · {c.atRisk} at risk</span>
              </div>
              <div className="mt-2 flex items-start gap-1.5 rounded-xl bg-primary/8 border border-primary/15 px-2.5 py-2">
                <Sparkles className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                <div className="text-[10px] text-primary font-medium">{c.action}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Intervention suggestions */}
      <GlassCard title="AI Intervention Suggestions" description="Top 3 actions recommended this week" action={<Lightbulb className="h-4 w-4 text-warning" />}>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title:"Assign Recursion practice",  desc:"10 problems, ramping difficulty — 38 students", impact:"+12% mastery",    icon:"📝", urgency:"high"   },
            { title:"Schedule Trees revision",     desc:"30-min topic recap focusing on Trees traversal", impact:"+18% engagement", icon:"📅", urgency:"medium" },
            { title:"Provide BFS/DFS videos",      desc:"Curated 3-video playlist on graph traversal",   impact:"+9% scores",      icon:"🎬", urgency:"low"    },
          ].map((s, i) => (
            <motion.div key={s.title} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
              className={cn("rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-elegant",
                s.urgency==="high"?"border-destructive/20 bg-destructive/5":s.urgency==="medium"?"border-warning/20 bg-warning/5":"border-border bg-gradient-to-br from-primary/5 to-transparent"
              )}>
              <div className="flex items-start justify-between">
                <div className="text-2xl">{s.icon}</div>
                <Badge className={cn("text-[9px]",
                  s.urgency==="high"?"bg-destructive/10 text-destructive":s.urgency==="medium"?"bg-warning/10 text-warning":"bg-muted text-muted-foreground"
                )}>{s.urgency}</Badge>
              </div>
              <div className="mt-2 text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.desc}</div>
              <div className="mt-3 inline-flex rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Estimated {s.impact}</div>
              <Link to="/teacher-interventions">
                <Button size="sm" variant="outline" className="mt-3 w-full gap-1">
                  Review <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* At-risk students */}
      <GlassCard title="Students Needing Attention" description="Ranked by AI risk score — click to view full profile" action={<Users className="h-4 w-4 text-destructive" />}>
        <div className="space-y-2">
          {atRiskStudents.map((s, i) => {
            const risk = predictRisk(s);
            return (
              <motion.div key={s.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                className={cn("flex items-center gap-3 rounded-2xl border p-3 transition hover:shadow-card",
                  s.risk==="high"?"border-destructive/20 bg-destructive/5":"border-warning/20 bg-warning/5"
                )}>
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={s.avatar} />
                  <AvatarFallback className={cn("text-xs text-white font-bold",s.risk==="high"?"bg-destructive":"bg-warning")}>
                    {s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground flex flex-wrap gap-1 mt-0.5">
                    <span>Score: {s.performance}%</span>
                    <span>· Attendance: {s.attendance}%</span>
                    {s.rootCause && <span className="text-destructive font-medium">· Root: {s.rootCause}</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {s.weakTopics.slice(0,2).map(t=>(
                      <span key={t} className="rounded-full bg-muted text-muted-foreground text-[9px] px-1.5 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className={cn("text-base font-bold",s.risk==="high"?"text-destructive":"text-warning")}>{risk.score}</div>
                  <div className="text-[9px] text-muted-foreground">risk score</div>
                </div>
                <Link to="/students/$id" params={{ id: s.id }}>
                  <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs shrink-0">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Knowledge Dependency CTA */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 flex flex-wrap items-center gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-glow">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-display font-bold text-lg">Knowledge Dependency Tree</div>
            <p className="text-sm text-muted-foreground mt-0.5">
              The AI maps every topic to its prerequisites. When a student struggles with Graphs, the system automatically checks if Recursion (the root prerequisite) was mastered first — then targets the actual gap.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {["Recursion","→","Trees","→","Graphs"].map((t, i) => (
              <span key={i} className={cn("text-sm font-medium",
                t==="→"?"text-muted-foreground":
                i===0?"rounded-full bg-destructive/10 text-destructive px-2.5 py-1 border border-destructive/20":
                i===2?"rounded-full bg-warning/10 text-warning px-2.5 py-1 border border-warning/20":
                "rounded-full bg-muted text-muted-foreground px-2.5 py-1"
              )}>{t}</span>
            ))}
            <TrendingUp className="h-4 w-4 text-success ml-1" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
