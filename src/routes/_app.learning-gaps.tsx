import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid, Legend, Treemap, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { AlertTriangle, Sparkles, ChevronRight, CheckCircle2, Brain, TrendingDown } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { learningGaps, students, topicMastery, interventions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/learning-gaps")({
  head: () => ({ meta: [{ title: "Learning Gaps — InsightEDU" }] }),
  component: LearningGapsPage,
});

const rootCauses = [
  { name: "Recursion",     students: 35, confidence: 92 },
  { name: "Array basics",  students: 22, confidence: 87 },
  { name: "Big-O notion",  students: 18, confidence: 84 },
  { name: "Math basics",   students: 15, confidence: 78 },
  { name: "Pointers",      students: 12, confidence: 81 },
  { name: "Other",         students:  9, confidence: 71 },
];

const riskDist = [
  { name: "Low",    value: 158, color: "var(--success)" },
  { name: "Medium", value: 56,  color: "var(--warning)" },
  { name: "High",   value: 34,  color: "var(--destructive)" },
];

const axisColor = "var(--muted-foreground)";
const grid      = "var(--border)";

// Build a treemap-friendly array from learningGaps
const treemapData = {
  name: "Topics",
  children: learningGaps.map(g => ({ name: g.topic, size: g.count, intensity: g.intensity })),
};

function TreemapCell({ x, y, width, height, name, intensity }: {
  x: number; y: number; width: number; height: number; name: string; depth: number; intensity: number;
}) {
  if (!width || !height) return null;
  const alpha = Math.round(intensity * 100);
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6}
        style={{ fill: `color-mix(in oklab, var(--destructive) ${alpha}%, var(--card))`,
          stroke: "var(--background)", strokeWidth: 2 }} />
      {width > 50 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 11, fontWeight: 600,
            fill: intensity > 0.5 ? "var(--destructive-foreground)" : "var(--foreground)" }}>
          {name}
        </text>
      )}
    </g>
  );
}

function LearningGapsPage() {
  const [approving, setApproving] = useState<string | null>(null);

  const highRisk = students.filter(s => s.risk === "high");
  const topGap = [...learningGaps].sort((a,b) => b.count - a.count)[0];
  const totalGapStudents = learningGaps.reduce((a,b) => a+b.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Learning Gap Analytics</h1>
          <p className="text-sm text-muted-foreground">Surface weak topics, trace root causes, and allocate targeted interventions.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-destructive/20 bg-destructive/8 px-3 py-1.5 text-sm">
            <span className="font-bold text-destructive">{highRisk.length}</span>
            <span className="text-muted-foreground ml-1">high-risk students</span>
          </div>
          <div className="rounded-xl border border-warning/20 bg-warning/8 px-3 py-1.5 text-sm">
            <span className="font-bold text-warning">{totalGapStudents}</span>
            <span className="text-muted-foreground ml-1">gap instances</span>
          </div>
        </div>
      </div>

      {/* AI insight banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-sm">AI Root-Cause Finding</div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            <strong className="text-foreground">{topGap?.count} students</strong> are struggling with <strong className="text-foreground">{topGap?.topic}</strong> — traced back to <strong className="text-foreground">Recursion fundamentals</strong> with 92% confidence. 
            Addressing this single root cause is projected to resolve gaps in <strong className="text-foreground">Trees, Graphs, and Dynamic Programming</strong> simultaneously.
          </p>
        </div>
        <Link to="/teacher-interventions">
          <Button size="sm" className="gradient-primary text-primary-foreground shrink-0 gap-1">
            Intervene <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="charts">
        <TabsList className="rounded-xl">
          <TabsTrigger value="charts"><TrendingDown className="mr-1.5 h-3.5 w-3.5" />Gap Charts</TabsTrigger>
          <TabsTrigger value="heatmap"><AlertTriangle className="mr-1.5 h-3.5 w-3.5" />Difficulty Map</TabsTrigger>
          <TabsTrigger value="students"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Student Details</TabsTrigger>
        </TabsList>

        {/* CHARTS TAB */}
        <TabsContent value="charts" className="mt-5 space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Weakest topics bar */}
            <GlassCard className="lg:col-span-2" title="Struggling Students by Topic" description="Total students with < 60% mastery">
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={[...learningGaps].sort((a,b) => b.count - a.count)} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="topic" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="count" name="Students" fill="var(--destructive)" radius={[6,6,0,0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Risk distribution */}
            <GlassCard title="Risk Distribution" description="Across all 248 students">
              <div className="h-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={riskDist} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                      {riskDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {riskDist.map(r => (
                  <div key={r.name} className="flex items-center gap-2 text-xs">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="flex-1 text-muted-foreground">{r.name} risk</span>
                    <span className="font-semibold">{r.value} students</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Root causes */}
            <GlassCard title="Most Common Root Causes" description="AI-detected prerequisite gaps with confidence scores">
              <div className="space-y-3">
                {rootCauses.map((r, i) => (
                  <motion.div key={r.name} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.06 }}
                    className="flex items-center gap-3">
                    <div className="w-6 text-xs text-muted-foreground text-right">{i+1}.</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{r.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{r.students} students</span>
                          <Badge className="bg-primary/10 text-primary text-[9px] px-1.5">{r.confidence}%</Badge>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div initial={{ width:0 }} animate={{ width: `${(r.students/40)*100}%` }} transition={{ duration: 0.7, delay: i*0.06 }}
                          className="h-full bg-destructive rounded-full" style={{ opacity: 0.7 + (r.confidence/1000) }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Topic mastery radar */}
            <GlassCard title="Class Mastery Radar" description="Average mastery across all topics">
              <div className="h-64">
                <ResponsiveContainer>
                  <RadarChart data={topicMastery.map(t => ({ subject: t.topic.replace(" Programming",""), mastery: t.mastered }))}>
                    <PolarGrid stroke={grid} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: axisColor, fontSize: 10 }} />
                    <Radar name="Mastered %" dataKey="mastery" stroke="var(--success)" fill="var(--success)" fillOpacity={0.12} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* HEATMAP TAB */}
        <TabsContent value="heatmap" className="mt-5 space-y-5">
          <GlassCard title="Topic Difficulty Treemap" description="Size = number of struggling students · Colour = intensity">
            <div className="h-72">
              <ResponsiveContainer>
                <Treemap data={treemapData.children} dataKey="size" nameKey="name"
                  content={(props: { x?: number; y?: number; width?: number; height?: number; name?: string; depth?: number; intensity?: number }) => (
                    <TreemapCell
                      x={props.x ?? 0} y={props.y ?? 0}
                      width={props.width ?? 0} height={props.height ?? 0}
                      name={props.name ?? ""} depth={props.depth ?? 0}
                      intensity={props.intensity ?? 0}
                    />
                  )}
                />
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard title="Topic Difficulty Heatmap" description="Color = struggle intensity · Number = students affected">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {learningGaps.map((g, i) => (
                <motion.div key={g.topic} initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.04 }}
                  className="relative aspect-square rounded-xl p-3 text-xs font-medium cursor-pointer hover:scale-105 transition-transform"
                  style={{ background: `color-mix(in oklab, var(--destructive) ${g.intensity*100}%, var(--card))`,
                    color: g.intensity > 0.5 ? "var(--destructive-foreground)" : "var(--foreground)" }}>
                  <div className="font-semibold leading-tight">{g.topic}</div>
                  <div className="absolute bottom-2 left-3 text-[10px] opacity-85">{g.count} students</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* STUDENTS TAB */}
        <TabsContent value="students" className="mt-5">
          <GlassCard title="Students with Learning Gaps" description={`${interventions.length} students have AI-generated intervention plans`}
            action={<AlertTriangle className="h-4 w-4 text-destructive" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Student</th>
                    <th className="py-3 pr-4 font-medium">Weak Topics</th>
                    <th className="py-3 pr-4 font-medium">Root Cause</th>
                    <th className="py-3 pr-4 font-medium">Priority</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interventions.map((iv, i) => (
                    <motion.tr key={iv.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
                      className="border-b last:border-0 hover:bg-accent/30 transition">
                      <td className="py-3 pr-4">
                        <Link to="/students/$id" params={{ id: iv.studentId }} className="font-medium hover:text-primary">{iv.studentName}</Link>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {iv.weakTopics.slice(0,2).map(t => (
                            <span key={t} className="rounded-full bg-destructive/10 text-destructive text-[10px] px-2 py-0.5">{t}</span>
                          ))}
                          {iv.weakTopics.length > 2 && <span className="text-[10px] text-muted-foreground">+{iv.weakTopics.length-2}</span>}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-warning/10 text-warning text-xs px-2 py-0.5">{iv.rootCause}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge className={cn("text-[10px]",
                          iv.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                        )}>{iv.priority}</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        {iv.status === "approved"
                          ? <Badge className="bg-success/10 text-success text-[10px] gap-1"><CheckCircle2 className="h-2.5 w-2.5" />Approved</Badge>
                          : <Badge className="bg-muted text-muted-foreground text-[10px]">Pending</Badge>}
                      </td>
                      <td className="py-3 text-right">
                        {iv.status === "pending" ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                            onClick={() => setApproving(iv.id)}>
                            {approving === iv.id ? <><Sparkles className="h-3 w-3 text-success" /> Sent!</> : <>Approve <ChevronRight className="h-3 w-3" /></>}
                          </Button>
                        ) : (
                          <Link to="/students/$id" params={{ id: iv.studentId }}>
                            <Button size="sm" variant="ghost" className="h-7 text-xs">View</Button>
                          </Link>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
