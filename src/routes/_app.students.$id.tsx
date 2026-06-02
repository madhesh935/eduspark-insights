import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, BookOpen, Video, FileText, PenLine, TrendingUp, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import {
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { GlassCard } from "@/components/glass-card";
import { RiskBadge } from "@/components/risk-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { students, classes } from "@/lib/mock-data";
import { generateLearningPath, predictRisk } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/students/$id")({
  loader: ({ params }) => {
    const student = students.find((s) => s.id === params.id);
    if (!student) throw notFound();
    return { student };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.student.name ?? "Student"} — InsightEDU` }] }),
  component: StudentProfile,
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">
      Student not found. <Link to="/students" className="text-primary">Go back</Link>
    </div>
  ),
});

function StudentProfile() {
  const { student } = Route.useLoaderData();
  const [note, setNote] = useState("Showed strong improvement after the 1-on-1 recursion session. Needs more practice on tree traversals before moving to graphs.");
  const [noteSaved, setNoteSaved] = useState(false);

  const risk = predictRisk(student);
  const learningPath = generateLearningPath(student);
  const cls = classes.find(c => c.id === student.classId);

  // Build topic mastery from the student's own topicMastery map
  const masteryList = Object.entries(student.topicMastery)
    .map(([topic, mastery]) => ({ topic, mastery }))
    .sort((a, b) => a.mastery - b.mastery);

  // Radar data from the student's topic mastery
  const radarData = masteryList.map(m => ({ subject: m.topic, mastery: m.mastery }));

  // Generate a plausible weekly timeline from performance
  const timeline = Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    score: Math.max(20, Math.min(100, student.performance - 18 + i * 3 + (Math.sin(i) * 4))),
  }));

  const handleSave = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Link to="/students" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to students
      </Link>

      {/* Profile header */}
      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20 shadow-card">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="text-lg font-bold">
                {student.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">{student.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>Grade {student.grade}</span>
                <span>·</span>
                <span>{cls?.name ?? "Data Structures"}</span>
                <span>·</span>
                <span>{student.attendance}% attendance</span>
              </div>
              {student.weakTopics.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {student.weakTopics.map(t => (
                    <span key={t} className="rounded-full bg-destructive/10 text-destructive text-[10px] px-2 py-0.5 font-medium">{t}</span>
                  ))}
                  {student.rootCause && (
                    <span className="rounded-full bg-warning/10 text-warning text-[10px] px-2 py-0.5 font-medium">Root: {student.rootCause}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge level={student.risk} />
            {[
              { label: "Performance", val: `${student.performance}%` },
              { label: "Gaps", val: String(student.gaps) },
              { label: "Risk Score", val: String(risk.score) },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="font-display text-lg font-bold mt-0.5">{s.val}</div>
              </div>
            ))}
            <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
              <Sparkles className="h-3.5 w-3.5" /> AI Feedback
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Topic mastery bars — real student data */}
        <GlassCard className="lg:col-span-2" title="Topic Mastery Analysis" description={`${masteryList.filter(m => m.mastery < 60).length} weak topics · based on all assessments`}>
          <div className="space-y-2.5">
            {masteryList.map((m, i) => (
              <motion.div key={m.topic} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{m.topic}</span>
                  <div className="flex items-center gap-2">
                    {m.mastery < 50 && <AlertTriangle className="h-3 w-3 text-destructive" />}
                    <span className={m.mastery < 50 ? "text-destructive font-bold" : m.mastery < 70 ? "text-warning font-semibold" : "text-success font-semibold"}>
                      {m.mastery}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.mastery}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05 }}
                    className="h-full rounded-full"
                    style={{
                      background: m.mastery < 50
                        ? "linear-gradient(90deg, var(--destructive), var(--warning))"
                        : m.mastery < 70
                          ? "var(--gradient-primary)"
                          : "var(--success)",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Dependency chain */}
        <GlassCard title="Root Cause Chain" description="AI-detected prerequisite failure">
          {student.rootCause ? (
            <div className="space-y-2">
              {student.weakTopics.concat([student.rootCause]).map((t, i) => {
                const isRoot = t === student.rootCause;
                return (
                  <div key={t}>
                    <div className={cn("flex items-center justify-between rounded-xl border p-3",
                      isRoot ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"
                    )}>
                      <div>
                        <div className="text-sm font-semibold">{t}</div>
                        {isRoot && <div className="text-[10px] font-bold uppercase tracking-wider text-destructive mt-0.5">Root Cause</div>}
                      </div>
                      <div className={cn("text-sm font-bold",
                        (student.topicMastery[t] ?? 0) < 50 ? "text-destructive" : "text-warning"
                      )}>
                        {student.topicMastery[t] ?? "—"}%
                      </div>
                    </div>
                    {i < student.weakTopics.length - 1 && <div className="my-1 ml-5 h-4 w-0.5 bg-border" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-success/10 border border-success/20 p-4 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
              <div className="mt-2 font-semibold text-success">No root cause gaps</div>
              <div className="text-xs text-muted-foreground mt-1">Student is on track across all prerequisite topics.</div>
            </div>
          )}

          {/* Risk prediction factors */}
          <div className="mt-4 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Factors</div>
            {risk.factors.slice(0,3).map(f => (
              <div key={f.factor} className="flex items-center gap-2 text-xs">
                <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", f.impact === "positive" ? "bg-success" : "bg-destructive")} />
                <span className="flex-1 text-muted-foreground">{f.factor}</span>
                <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full", f.impact === "positive" ? "bg-success" : "bg-destructive")} style={{ width: `${f.weight}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Radar + Timeline */}
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard title="Skill Radar" description="Competency map across all topics">
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Radar name="Mastery" dataKey="mastery" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Performance Timeline" description="Weekly score trend (8 weeks)">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={timeline} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} domain={[20, 100]} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" name="Score" stroke="var(--primary)" strokeWidth={3}
                  dot={{ r: 4, fill: "var(--primary)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Learning path + Recommendations */}
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard title="Learning Path" description="AI-generated personalised steps" action={<TrendingUp className="h-4 w-4 text-primary" />}>
          <div className="space-y-2">
            {learningPath.length > 0 ? learningPath.map((step, i) => (
              <div key={step.topic} className={cn("flex items-center gap-3 rounded-xl border p-3 transition",
                step.status === "current" ? "border-primary/30 bg-primary/8"
                : step.status === "completed" ? "border-success/20 bg-success/5"
                : "border-border bg-muted/20"
              )}>
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  step.status === "current" ? "gradient-primary text-primary-foreground shadow-glow"
                  : step.status === "completed" ? "bg-success/20 text-success"
                  : "bg-muted text-muted-foreground"
                )}>
                  {step.status === "completed" ? "✓" : i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{step.topic}</div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {step.estimatedTime}
                    {step.status === "current" && <Badge className="ml-1 bg-primary/10 text-primary text-[9px] px-1.5 h-4">In progress</Badge>}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-sm text-muted-foreground">No gaps detected — student is on track! 🎉</div>
            )}
          </div>
        </GlassCard>

        <div className="space-y-5">
          {/* AI Recommendations */}
          <GlassCard title="AI Recommendations" description="Personalised resources for this student" action={<Sparkles className="h-4 w-4 text-primary" />}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Video,     title: `${student.rootCause || "Recursion"} explained`, type: "Video · 12 min" },
                { icon: FileText,  title: "Tree traversal cheatsheet",                      type: "Notes · 2 pages" },
                { icon: BookOpen,  title: "20 practice problems",                           type: "Practice set" },
                { icon: Sparkles,  title: "AI Tutor: deep-dive session",                    type: "Interactive" },
              ].map((r) => (
                <div key={r.title} className="rounded-xl border border-border bg-card p-3 transition hover:border-primary/40 hover:shadow-elegant hover:-translate-y-0.5 cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <r.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-2 text-sm font-semibold leading-tight">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.type}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Teacher Notes */}
          <GlassCard title="Teacher Notes" description="Private notes — not visible to student" action={<PenLine className="h-4 w-4 text-muted-foreground" />}>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a private note..."
              className="min-h-24 resize-none text-sm"
            />
            <Button
              size="sm"
              className={cn("mt-3 gap-2", noteSaved ? "bg-success text-success-foreground" : "gradient-primary text-primary-foreground")}
              onClick={handleSave}
            >
              {noteSaved ? <><CheckCircle2 className="h-3.5 w-3.5" /> Saved!</> : "Save note"}
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
