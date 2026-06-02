import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import {
  Users, UserCheck, AlertTriangle, TrendingUp, BellRing, Sparkles, ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { GlassCard } from "@/components/glass-card";
import {
  stats, weeklyPerformance, monthlyProgress, topicMastery,
  learningGaps, aiInsights, recentAlerts,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — InsightEDU" }] }),
  component: Dashboard,
});

const chartGrid = "var(--border)";
const axisColor = "var(--muted-foreground)";

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Good morning, Sara 👋</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening across your classrooms today.</p>
        </div>
        <Link to="/reports" className="inline-flex items-center gap-2 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
          Generate report <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} tone="primary" delta={4} index={0} />
        <StatCard label="Active" value={stats.activeStudents} icon={UserCheck} tone="success" delta={8} index={1} />
        <StatCard label="At Risk" value={stats.atRiskStudents} icon={AlertTriangle} tone="destructive" delta={-3} index={2} />
        <StatCard label="Avg Performance" value={`${stats.avgPerformance}%`} icon={TrendingUp} tone="warning" delta={5} index={3} />
        <StatCard label="Gap Alerts" value={stats.learningGapAlerts} icon={BellRing} index={4} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" title="Weekly Performance Trend" description="Average score & engagement across all classes">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={weeklyPerformance} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="engagement" stroke="var(--chart-2)" fill="url(#g2)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Monthly Mastery" description="Class-wide concept mastery">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={monthlyProgress} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="mastery" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" title="Topic Mastery Distribution" description="Mastered vs struggling per topic">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={topicMastery} margin={{ left: -20, right: 8 }}>
                <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="topic" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="mastered" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="struggling" stackId="a" fill="var(--destructive)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Recent Alerts" description="Live notifications">
          <div className="space-y-3">
            {recentAlerts.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3 rounded-xl border border-border/60 p-3 transition hover:bg-accent/40"
              >
                <div className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full",
                  a.priority === "high" ? "bg-destructive animate-pulse" :
                  a.priority === "medium" ? "bg-warning" : "bg-success")} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-tight">{a.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" title="Learning Gap Heatmap" description="Topic difficulty intensity — darker = more students struggling">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {learningGaps.map((g, i) => (
              <motion.div
                key={g.topic}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="relative aspect-square rounded-xl p-3 text-xs font-medium transition hover:scale-105"
                style={{
                  background: `color-mix(in oklab, var(--destructive) ${g.intensity * 100}%, var(--card))`,
                  color: g.intensity > 0.5 ? "var(--destructive-foreground)" : "var(--foreground)",
                }}
              >
                <div className="font-semibold">{g.topic}</div>
                <div className="absolute bottom-2 left-3 text-[10px] opacity-80">{g.count} struggling</div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="AI Insights" description="Automatically generated by InsightEDU" action={<Sparkles className="h-4 w-4 text-primary" />}>
          <div className="space-y-3">
            {aiInsights.map((ins, i) => (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-transparent p-3"
              >
                <div className="text-sm font-medium leading-snug">{ins.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">Root cause: <span className="text-foreground font-medium">{ins.root}</span></div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Confidence</span>
                  <span className="text-xs font-semibold text-primary">{ins.confidence}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full gradient-primary" style={{ width: `${ins.confidence}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
