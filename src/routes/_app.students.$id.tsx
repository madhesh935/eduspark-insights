import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, BookOpen, Video, FileText, PenLine } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { GlassCard } from "@/components/glass-card";
import { RiskBadge } from "@/components/risk-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { students, studentMastery, studentTimeline } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/students/$id")({
  loader: ({ params }) => {
    const student = students.find((s) => s.id === params.id);
    if (!student) throw notFound();
    return { student };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.student.name ?? "Student"} — InsightEDU` }] }),
  component: StudentProfile,
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Student not found. <Link to="/students" className="text-primary">Go back</Link></div>
  ),
});

function StudentProfile() {
  const { student } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <Link to="/students" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to students
      </Link>

      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={student.avatar} />
              <AvatarFallback>{student.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">{student.name}</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                Grade {student.grade} · {student.attendance}% attendance
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RiskBadge level={student.risk} />
            <div className="rounded-xl border border-border bg-card px-4 py-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Overall</div>
              <div className="font-display text-xl font-bold">{student.performance}%</div>
            </div>
            <Button className="gradient-primary text-primary-foreground"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Generate feedback</Button>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" title="Learning Gap Analysis" description="Mastery by topic">
          <div className="space-y-3">
            {studentMastery.map((m, i) => (
              <motion.div
                key={m.topic}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{m.topic}</span>
                  <span className={m.mastery < 50 ? "text-destructive font-semibold" : "text-muted-foreground"}>{m.mastery}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.mastery}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="h-full rounded-full"
                    style={{
                      background: m.mastery < 50
                        ? "linear-gradient(90deg, var(--destructive), var(--warning))"
                        : "var(--gradient-primary)",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Concept Dependency" description="Root cause traced">
          <div className="space-y-3">
            {[
              { name: "Recursion", root: true, mastery: 40 },
              { name: "Trees", root: false, mastery: 45 },
              { name: "Graphs", root: false, mastery: 38 },
            ].map((c, i) => (
              <div key={c.name}>
                <div className={`flex items-center justify-between rounded-xl border p-3 ${c.root ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    {c.root && <div className="text-[10px] font-bold uppercase tracking-wider text-destructive">Root cause</div>}
                  </div>
                  <div className="text-sm font-bold">{c.mastery}%</div>
                </div>
                {i < 2 && <div className="my-1 ml-5 h-3 w-0.5 bg-border" />}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Performance Timeline" description="Weekly score trend">
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={studentTimeline} margin={{ left: -20, right: 8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5, fill: "var(--primary)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard title="AI Recommendations" description="Personalized for this student" action={<Sparkles className="h-4 w-4 text-primary" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Video, title: "Recursion in 12 minutes", type: "Video" },
              { icon: FileText, title: "Tree Traversal cheatsheet", type: "Notes" },
              { icon: BookOpen, title: "20 graph practice problems", type: "Practice" },
              { icon: Sparkles, title: "AI Tutor: BFS deep-dive", type: "Tutor" },
            ].map((r) => (
              <div key={r.title} className="rounded-xl border border-border bg-card p-3 transition hover:border-primary/40 hover:shadow-elegant">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <r.icon className="h-4 w-4" />
                </div>
                <div className="mt-2 text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.type}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Teacher Notes" description="Private notes about this student" action={<PenLine className="h-4 w-4 text-muted-foreground" />}>
          <Textarea placeholder="Add a note..." className="min-h-32 resize-none" defaultValue="Showed strong improvement after 1-on-1 recursion session. Needs more practice on tree traversals before moving to graphs." />
          <Button size="sm" className="mt-3 gradient-primary text-primary-foreground">Save note</Button>
        </GlassCard>
      </div>
    </div>
  );
}
