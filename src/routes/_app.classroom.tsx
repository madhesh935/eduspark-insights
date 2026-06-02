import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Activity, Smile, Meh, Frown, Users, Hand } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { classroomLive } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/classroom")({
  head: () => ({ meta: [{ title: "Classroom Analytics — InsightEDU" }] }),
  component: ClassroomPage,
});

function ClassroomPage() {
  const [engagement, setEngagement] = useState(classroomLive.engagement);
  const [participation, setParticipation] = useState(classroomLive.participation);

  useEffect(() => {
    const t = setInterval(() => {
      setEngagement((v) => Math.max(45, Math.min(95, v + (Math.random() * 6 - 3))));
      setParticipation((v) => Math.max(40, Math.min(90, v + (Math.random() * 5 - 2.5))));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const data = [
    { name: "Understood", value: classroomLive.understood, color: "var(--success)" },
    { name: "Partial", value: classroomLive.partial, color: "var(--warning)" },
    { name: "Confused", value: classroomLive.confused, color: "var(--destructive)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Live Classroom</h1>
          <p className="text-sm text-muted-foreground">Real-time engagement & understanding for Class 10-B</p>
        </div>
        <Badge className="bg-success/15 text-success ring-1 ring-success/30">
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
        </Badge>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Now teaching</div>
            <div className="font-display text-xl font-bold">{classroomLive.topic}</div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-border bg-card px-4 py-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Students</div>
              <div className="font-bold">32</div>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</div>
              <div className="font-bold">24m</div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard title="Engagement" description="Live signal" action={<Activity className="h-4 w-4 text-primary" />}>
          <div className="text-center">
            <motion.div key={Math.round(engagement)} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="font-display text-5xl font-bold text-gradient">
              {Math.round(engagement)}%
            </motion.div>
            <div className="mt-2 text-xs text-muted-foreground">↑ from 72% at start</div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div animate={{ width: `${engagement}%` }} className="h-full gradient-primary" />
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Participation" description="Hands raised / questions" action={<Hand className="h-4 w-4 text-primary" />}>
          <div className="text-center">
            <motion.div key={Math.round(participation)} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="font-display text-5xl font-bold">
              {Math.round(participation)}%
            </motion.div>
            <div className="mt-2 text-xs text-muted-foreground">14 questions asked</div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div animate={{ width: `${participation}%` }} className="h-full bg-warning" />
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Class Mood" description="Sentiment indicators" action={<Users className="h-4 w-4 text-primary" />}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-success/10 p-3"><Smile className="mx-auto h-6 w-6 text-success" /><div className="mt-1 font-bold">65%</div><div className="text-[10px] text-muted-foreground">Happy</div></div>
            <div className="rounded-xl bg-warning/10 p-3"><Meh className="mx-auto h-6 w-6 text-warning" /><div className="mt-1 font-bold">20%</div><div className="text-[10px] text-muted-foreground">Neutral</div></div>
            <div className="rounded-xl bg-destructive/10 p-3"><Frown className="mx-auto h-6 w-6 text-destructive" /><div className="mt-1 font-bold">15%</div><div className="text-[10px] text-muted-foreground">Confused</div></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Live Understanding" description="Polled every 60 seconds">
        <div className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={70} outerRadius={120} paddingAngle={3} label>
                {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--popover)", border: `1px solid var(--border)`, borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
