import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import {
  FileBarChart, FileSpreadsheet, FileText, Download, Users, BookOpen,
  AlertTriangle, TrendingUp, Clock, CheckCircle, Sparkles, ChevronRight,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  students, weeklyPerformance, monthlyProgress, topicMastery,
  learningGaps, teachers, classes,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — InsightEDU" }] }),
  component: ReportsPage,
});

const axisColor = "var(--muted-foreground)";
const grid = "var(--border)";

// Pre-computed report data
const atRisk = students.filter(s => s.risk !== "low");
const topPerformers = [...students].sort((a,b) => b.performance - a.performance).slice(0,5);
const mostImproved = [
  { name: "Priya Kapoor",    before: 52, after: 78, gain: 26 },
  { name: "Rohan Singh",     before: 48, after: 71, gain: 23 },
  { name: "Diya Mehta",      before: 55, after: 76, gain: 21 },
  { name: "Kabir Nair",      before: 44, after: 64, gain: 20 },
  { name: "Ananya Gupta",    before: 60, after: 79, gain: 19 },
];
const classComparison = classes.map(c => ({
  name: c.name,
  avg: c.avgPerformance,
  gaps: c.gapAlerts,
}));
const gradeBreakdown = ["8","9","10","11","12"].map(g => {
  const gs = students.filter(s => s.grade === g);
  return {
    grade: `G${g}`,
    count: gs.length,
    avg: Math.round(gs.reduce((a,b) => a+b.performance,0)/gs.length),
    atRisk: gs.filter(s => s.risk !== "low").length,
  };
});
const subjectRadar = [
  { subject: "Arrays",      mastery: 88 },
  { subject: "Recursion",   mastery: 48 },
  { subject: "Trees",       mastery: 42 },
  { subject: "Graphs",      mastery: 35 },
  { subject: "DP",          mastery: 38 },
  { subject: "Sorting",     mastery: 72 },
];
const interventionImpact = [
  { week: "Before", avg: 54, atRisk: 28 },
  { week: "Week 1", avg: 58, atRisk: 25 },
  { week: "Week 2", avg: 62, atRisk: 22 },
  { week: "Week 3", avg: 68, atRisk: 18 },
  { week: "Week 4", avg: 74, atRisk: 14 },
];

function ReportsPage() {
  const [generating, setGenerating] = useState<string|null>(null);
  const handleGenerate = (name: string) => {
    setGenerating(name);
    setTimeout(() => setGenerating(null), 1400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive performance data across all classes, students, and topics.</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
          <Download className="h-4 w-4" /> Export All Reports
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={students.length} icon={Users} tone="primary" index={0} subtitle="Across all classes" />
        <StatCard label="At Risk" value={atRisk.length} icon={AlertTriangle} tone="destructive" delta={-3} index={1} subtitle="Need intervention" />
        <StatCard label="Avg Performance" value={`${Math.round(students.reduce((a,b)=>a+b.performance,0)/students.length)}%`} icon={TrendingUp} tone="success" delta={8} index={2} subtitle="This semester" />
        <StatCard label="Active Classes" value={classes.length} icon={BookOpen} tone="primary" index={3} subtitle={`${teachers.length} teachers`} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="rounded-xl">
          <TabsTrigger value="overview"><TrendingUp className="mr-1.5 h-3.5 w-3.5" />Overview</TabsTrigger>
          <TabsTrigger value="students"><Users className="mr-1.5 h-3.5 w-3.5" />Students</TabsTrigger>
          <TabsTrigger value="topics"><BookOpen className="mr-1.5 h-3.5 w-3.5" />Topics</TabsTrigger>
          <TabsTrigger value="export"><FileBarChart className="mr-1.5 h-3.5 w-3.5" />Export</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-5 space-y-5">
          {/* Weekly trend + Grade breakdown */}
          <div className="grid gap-5 lg:grid-cols-3">
            <GlassCard className="lg:col-span-2" title="Performance Trend (7 Weeks)" description="Average score across all classes">
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={weeklyPerformance} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="score" name="Score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
                    <Line type="monotone" dataKey="engagement" name="Engagement" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard title="Grade-wise Breakdown" description="Avg score per grade">
              <div className="space-y-2.5">
                {gradeBreakdown.map((g) => (
                  <div key={g.grade} className="flex items-center gap-3">
                    <div className="w-8 text-xs font-semibold text-muted-foreground">{g.grade}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{g.count} students</span>
                        <span className="font-semibold">{g.avg}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${g.avg}%` }} transition={{ duration: 0.7, delay: 0.1 }}
                          className="h-full gradient-primary rounded-full" />
                      </div>
                    </div>
                    <Badge className={cn("text-[10px] shrink-0",
                      g.atRisk > 5 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                    )}>{g.atRisk} at risk</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Class comparison */}
          <GlassCard title="Class Performance Comparison" description="Average score vs gap alerts per class">
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={classComparison} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="avg" name="Avg Score" fill="var(--primary)" radius={[6,6,0,0]} />
                  <Bar dataKey="gaps" name="Gap Alerts" fill="var(--destructive)" radius={[6,6,0,0]} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Intervention impact */}
          <GlassCard title="Intervention Impact Over 4 Weeks" description="Average score and at-risk count after AI interventions were applied">
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={interventionImpact} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="avg" name="Avg Score" stroke="var(--success)" strokeWidth={3} dot={{ r: 5, fill: "var(--success)" }} />
                  <Line type="monotone" dataKey="atRisk" name="At-Risk Count" stroke="var(--destructive)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </TabsContent>

        {/* STUDENTS TAB */}
        <TabsContent value="students" className="mt-5 space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Top performers */}
            <GlassCard title="Top Performers" description="Highest scoring students this semester">
              <div className="space-y-2">
                {topPerformers.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-3 hover:bg-accent/30 transition">
                    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      i === 0 ? "bg-warning text-warning-foreground" : i < 3 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <Link to="/students/$id" params={{ id: s.id }} className="text-sm font-semibold hover:text-primary truncate block">{s.name}</Link>
                      <div className="text-xs text-muted-foreground">Grade {s.grade}</div>
                    </div>
                    <div className="font-bold text-success">{s.performance}%</div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Most improved */}
            <GlassCard title="Most Improved" description="Biggest score gains this month">
              <div className="space-y-2">
                {mostImproved.map((s, i) => (
                  <motion.div key={s.name} initial={{ opacity:0, x:6 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{s.name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs text-muted-foreground">{s.before}%</span>
                        <div className="h-1.5 flex-1 max-w-[80px] rounded-full bg-muted overflow-hidden">
                          <motion.div initial={{ width: `${(s.before/100)*100}%` }} animate={{ width: `${s.after}%` }} className="h-full bg-success" />
                        </div>
                        <span className="text-xs font-semibold text-success">{s.after}%</span>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success text-xs">+{s.gain}%</Badge>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* At-risk table */}
          <GlassCard title="Students Requiring Intervention" description={`${atRisk.length} students flagged across all classes`} action={<AlertTriangle className="h-4 w-4 text-destructive" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Student</th>
                    <th className="py-3 pr-4 font-medium">Grade</th>
                    <th className="py-3 pr-4 font-medium">Score</th>
                    <th className="py-3 pr-4 font-medium">Attendance</th>
                    <th className="py-3 pr-4 font-medium">Root Cause</th>
                    <th className="py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {atRisk.slice(0,8).map((s, i) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-accent/30 transition">
                      <td className="py-3 pr-4">
                        <Link to="/students/$id" params={{ id: s.id }} className="font-medium hover:text-primary">{s.name}</Link>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">Gr. {s.grade}</td>
                      <td className="py-3 pr-4">
                        <span className={s.performance < 50 ? "text-destructive font-semibold" : "text-warning font-semibold"}>{s.performance}%</span>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{s.attendance}%</td>
                      <td className="py-3 pr-4">
                        {s.rootCause ? <span className="rounded-full bg-destructive/10 text-destructive text-xs px-2 py-0.5">{s.rootCause}</span> : "—"}
                      </td>
                      <td className="py-3">
                        <Link to="/teacher-interventions">
                          <Button size="sm" variant="outline" className="gap-1 h-7 text-xs">Intervene <ChevronRight className="h-3 w-3" /></Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>

        {/* TOPICS TAB */}
        <TabsContent value="topics" className="mt-5 space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <GlassCard title="Topic Mastery Radar" description="Class-wide concept coverage">
              <div className="h-72">
                <ResponsiveContainer>
                  <RadarChart data={subjectRadar}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: axisColor, fontSize: 11 }} />
                    <Radar name="Mastery" dataKey="mastery" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard title="Topic Difficulty" description="Percentage of students struggling">
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={[...topicMastery].sort((a,b)=>b.struggling-a.struggling)} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid stroke={grid} strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="topic" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="struggling" name="Struggling %" fill="var(--destructive)" radius={[0,6,6,0]} opacity={0.8} />
                    <Bar dataKey="mastered" name="Mastered %" fill="var(--success)" radius={[0,6,6,0]} opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Heatmap */}
          <GlassCard title="Topic Difficulty Heatmap" description="Color intensity reflects how many students are struggling">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {learningGaps.map((g, i) => (
                <motion.div key={g.topic} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.04 }}
                  className="relative aspect-square rounded-xl p-3 text-xs font-medium hover:scale-105 transition-transform"
                  style={{ background: `color-mix(in oklab, var(--destructive) ${g.intensity*100}%, var(--card))`,
                    color: g.intensity > 0.5 ? "var(--destructive-foreground)" : "var(--foreground)" }}>
                  <div className="font-semibold leading-tight">{g.topic}</div>
                  <div className="absolute bottom-2 left-3 text-[10px] opacity-80">{g.count} struggling</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* EXPORT TAB */}
        <TabsContent value="export" className="mt-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Student Performance Summary", desc: "Individual scores, mastery and attendance for all 100 students", icon: FileBarChart, pages: "12 pages", size: "2.4 MB" },
              { title: "Learning Gaps Report",        desc: "Topic-by-topic gap analysis with root cause detection",          icon: FileText, pages: "8 pages", size: "1.8 MB" },
              { title: "AI Intervention Log",         desc: "All approved interventions and their measured impact",           icon: Sparkles, pages: "5 pages", size: "0.9 MB" },
              { title: "Class Trends Report",         desc: "Weekly & monthly performance per class with forecasts",          icon: TrendingUp, pages: "10 pages", size: "2.1 MB" },
              { title: "Risk Assessment Report",      desc: "At-risk students ranked by AI risk score",                       icon: AlertTriangle, pages: "6 pages", size: "1.2 MB" },
              { title: "Teacher Activity Summary",    desc: "Assessment creation, interventions and class engagement",        icon: Users, pages: "4 pages", size: "0.8 MB" },
            ].map((r) => (
              <GlassCard key={r.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold text-sm">{r.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {r.pages} · {r.size}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handleGenerate(r.title+"pdf")}>
                    {generating === r.title+"pdf" ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <Download className="h-3.5 w-3.5" />}
                    PDF
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handleGenerate(r.title+"xlsx")}>
                    {generating === r.title+"xlsx" ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                    Excel
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
