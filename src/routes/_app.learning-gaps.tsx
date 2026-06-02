import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { GlassCard } from "@/components/glass-card";
import { learningGaps } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/learning-gaps")({
  head: () => ({ meta: [{ title: "Learning Gaps — InsightEDU" }] }),
  component: LearningGapsPage,
});

const rootCauses = [
  { name: "Recursion", value: 35 },
  { name: "Pointers", value: 22 },
  { name: "Big-O", value: 18 },
  { name: "Math basics", value: 15 },
  { name: "Other", value: 10 },
];

const riskDist = [
  { name: "Low", value: 158, color: "var(--success)" },
  { name: "Medium", value: 56, color: "var(--warning)" },
  { name: "High", value: 34, color: "var(--destructive)" },
];

function LearningGapsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Learning Gap Analytics</h1>
        <p className="text-sm text-muted-foreground">Surface the weakest topics, trace root causes, allocate intervention.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" title="Weakest Topics" description="Students struggling per topic">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={[...learningGaps].sort((a, b) => b.count - a.count)} margin={{ left: -20, right: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="topic" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Student Risk Distribution" description="Across all classes">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskDist} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {riskDist.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard title="Most Common Root Causes" description="AI-detected prerequisites">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={rootCauses} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Topic Difficulty Heatmap" description="Color intensity reflects struggle level">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {learningGaps.map((g) => (
              <div
                key={g.topic}
                className="relative aspect-square rounded-xl p-3 text-xs font-medium"
                style={{
                  background: `color-mix(in oklab, var(--destructive) ${g.intensity * 100}%, var(--card))`,
                  color: g.intensity > 0.5 ? "var(--destructive-foreground)" : "var(--foreground)",
                }}
              >
                <div className="font-semibold">{g.topic}</div>
                <div className="absolute bottom-2 left-3 text-[10px] opacity-80">{g.count}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
