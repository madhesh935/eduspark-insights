import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, TrendingUp, AlertTriangle, BookOpen, School, BarChart3, Download, ChevronRight, Award } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, PieChart, Pie,
} from "recharts";
import { institutionStats, departmentStats, subjectAnalytics, students, teachers, monthlyProgress } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/admin-dashboard")({
  head: () => ({ meta: [{ title: "Admin Analytics — InsightEDU" }] }),
  component: AdminDashboard,
});

const axisColor = "var(--muted-foreground)";
const grid = "var(--border)";

const riskPie = [
  { name: "Low Risk",  value: students.filter(s=>s.risk==="low").length,    color: "var(--success)" },
  { name: "Medium",    value: students.filter(s=>s.risk==="medium").length,  color: "var(--warning)" },
  { name: "High Risk", value: students.filter(s=>s.risk==="high").length,    color: "var(--destructive)" },
];

const semesterTrend = [
  { month: "Aug", score: 64, atRisk: 112 },
  { month: "Sep", score: 67, atRisk: 104 },
  { month: "Oct", score: 66, atRisk: 108 },
  { month: "Nov", score: 69, atRisk: 98 },
  { month: "Dec", score: 70, atRisk: 94 },
  { month: "Jan", score: 72, atRisk: 87 },
];

function AdminDashboard() {
  const atRiskStudents = students.filter((s) => s.risk === "high").slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Institution Analytics</h1>
            <Badge variant="secondary" className="gap-1">
              <School className="h-3 w-3" />{institutionStats.name}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">School-wide performance overview, risk analysis, and department insights.</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Mega stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Students"  value={institutionStats.totalStudents.toLocaleString()} icon={Users}          tone="primary"     index={0} delta={4}  subtitle="This academic year" />
        <StatCard label="Teachers"        value={institutionStats.totalTeachers}                   icon={BookOpen}      tone="success"     index={1} delta={2}  subtitle={`${institutionStats.totalClasses} classes`} />
        <StatCard label="At-Risk Students" value={institutionStats.atRiskStudents}                 icon={AlertTriangle} tone="destructive" index={2} delta={-8} subtitle="Flagged this month" />
        <StatCard label="Institution Avg"  value={`${institutionStats.avgScore}%`}                 icon={TrendingUp}    tone="warning"     index={3} delta={6}  subtitle="Semester 2 · 2025" />
      </div>

      {/* Semester trend + Risk pie */}
      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" title="Semester Performance Trend" description="Average score and at-risk count over 6 months">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={semesterTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="score" name="Avg Score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
                <Line type="monotone" dataKey="atRisk" name="At-Risk Count" stroke="var(--destructive)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Risk Distribution" description="All 1,240 students">
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskPie} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={4}>
                  {riskPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {riskPie.map(r => (
              <div key={r.name} className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ background: r.color }} />
                <span className="flex-1 text-muted-foreground">{r.name}</span>
                <span className="font-semibold">{r.value} students</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Department + Subject */}
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard title="Department Performance" description="Average scores by department">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={departmentStats} layout="vertical" margin={{ left: 10, right: 24 }}>
                <CartesianGrid stroke={grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="avgScore" name="Avg Score" radius={[0,6,6,0]}>
                  {departmentStats.map((d) => (
                    <Cell key={d.dept} fill={d.avgScore >= 75 ? "var(--success)" : d.avgScore >= 65 ? "var(--primary)" : "var(--warning)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Subject Performance" description="All subjects — score vs at-risk count">
          <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-thin pr-1">
            {subjectAnalytics.map((s, i) => (
              <motion.div key={s.subject} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3">
                <div className="w-24 shrink-0 text-xs text-muted-foreground truncate font-medium">{s.subject}</div>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.avgScore}%` }} transition={{ duration: 0.7, delay: i * 0.05 }}
                    className={cn("h-full rounded-full", s.avgScore >= 75 ? "bg-success" : s.avgScore >= 65 ? "gradient-primary" : "bg-warning")} />
                </div>
                <div className="text-xs font-semibold w-10 shrink-0 text-right">{s.avgScore}%</div>
                <Badge variant="outline" className="text-[10px] shrink-0">{s.atRisk} risk</Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Teacher performance table */}
      <GlassCard title="Teacher Performance Summary" description="Engagement and student outcomes per teacher">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Teacher</th>
                <th className="py-3 pr-4 font-medium">Subject</th>
                <th className="py-3 pr-4 font-medium">Department</th>
                <th className="py-3 pr-4 font-medium">Classes</th>
                <th className="py-3 pr-4 font-medium">Students</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                  className="border-b last:border-0 hover:bg-accent/30 transition">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 shrink-0 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
                        {t.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{t.subject}</td>
                  <td className="py-3 pr-4"><Badge variant="secondary" className="text-[10px]">{t.department}</Badge></td>
                  <td className="py-3 pr-4 font-semibold">{t.classCount}</td>
                  <td className="py-3 pr-4 font-semibold">{t.studentCount}</td>
                  <td className="py-3">
                    <Link to="/students">
                      <Button size="sm" variant="outline" className="gap-1 h-7 text-xs">
                        View <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* At-Risk Students */}
      <GlassCard title="High-Risk Students — Immediate Action Required" description="Students predicted to fail without intervention"
        action={<AlertTriangle className="h-4 w-4 text-destructive" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Student</th>
                <th className="py-3 pr-4 font-medium">Grade</th>
                <th className="py-3 pr-4 font-medium">Score</th>
                <th className="py-3 pr-4 font-medium">Attendance</th>
                <th className="py-3 pr-4 font-medium">Weak Topics</th>
                <th className="py-3 font-medium">Root Cause</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="border-b last:border-0 hover:bg-accent/30 transition">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-destructive animate-pulse shrink-0" />
                      <Link to="/students/$id" params={{ id: s.id }} className="font-medium hover:text-primary">{s.name}</Link>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.grade}</td>
                  <td className="py-3 pr-4 font-bold text-destructive">{s.performance}%</td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.attendance}%</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {s.weakTopics.slice(0, 2).map(t => (
                        <span key={t} className="rounded-full bg-destructive/10 text-destructive text-[10px] px-1.5 py-0.5">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-xs text-warning font-medium">{s.rootCause || "—"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/teacher-interventions">
          <Button className="mt-4 gradient-primary text-primary-foreground gap-2">
            <Award className="h-4 w-4" /> Generate Bulk Interventions
          </Button>
        </Link>
      </GlassCard>

      {/* Subject detail cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjectAnalytics.slice(0, 6).map((s, i) => (
          <motion.div key={s.subject} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard>
              <div className="flex items-start justify-between">
                <div className="font-semibold">{s.subject}</div>
                <Badge variant={s.atRisk > 10 ? "destructive" : "secondary"} className="text-[10px]">{s.atRisk} at risk</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-muted/60 p-2"><div className="font-bold text-base">{s.avgScore}%</div><div className="text-muted-foreground">Avg</div></div>
                <div className="rounded-xl bg-muted/60 p-2"><div className="font-bold text-base text-success">+{s.improvement}%</div><div className="text-muted-foreground">Growth</div></div>
                <div className="rounded-xl bg-muted/60 p-2"><div className="font-bold text-base text-destructive">{s.atRisk}</div><div className="text-muted-foreground">Risk</div></div>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full", s.avgScore >= 75 ? "bg-success" : s.avgScore >= 65 ? "gradient-primary" : "bg-warning")}
                  style={{ width: `${s.avgScore}%` }} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Weak area: <span className="font-medium text-warning">{s.weakTopic}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
