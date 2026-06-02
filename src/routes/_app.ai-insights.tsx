import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Target, Lightbulb, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights — InsightEDU" }] }),
  component: AIInsightsPage,
});

function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">AI Insights</h1>
        <p className="text-sm text-muted-foreground">Root-cause detection, risk prediction, and intervention suggestions.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard title="Root Cause Detection" description="Tracing learning gaps to their origin" action={<Sparkles className="h-4 w-4 text-primary" />}>
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="text-xs uppercase tracking-wider text-destructive">Weak topic</div>
              <div className="mt-1 font-display text-2xl font-bold">Graphs</div>
              <div className="mt-4 flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Root cause</div>
                  <div className="font-display text-xl font-bold text-gradient">Recursion</div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">AI confidence</span><span className="font-semibold text-primary">92%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full gradient-primary" style={{ width: "92%" }} /></div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard title="Risk Prediction" description="Predictive model output" action={<Target className="h-4 w-4 text-primary" />}>
            <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-warning">Predicted risk</div>
                  <div className="mt-1 font-display text-2xl font-bold">High</div>
                </div>
                <div className="text-3xl">⚠️</div>
              </div>
              <div className="mt-4 text-sm">
                Aanya Sharma's assessment scores have declined 18% over 2 weeks and attendance dropped to 72%.
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-background/60 p-2"><div className="font-bold text-base">-18%</div><div className="text-muted-foreground">Scores</div></div>
                <div className="rounded-lg bg-background/60 p-2"><div className="font-bold text-base">72%</div><div className="text-muted-foreground">Attendance</div></div>
                <div className="rounded-lg bg-background/60 p-2"><div className="font-bold text-base">4w</div><div className="text-muted-foreground">Lead time</div></div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <GlassCard title="Intervention Suggestions" description="AI-curated next actions" action={<Lightbulb className="h-4 w-4 text-warning" />}>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: "Assign Recursion practice", desc: "10 problems, ramping difficulty", impact: "+12% mastery" },
            { title: "Schedule revision session", desc: "30min topic recap with Class 10-B", impact: "+18% engagement" },
            { title: "Provide video resources", desc: "Curated 3-video playlist on BFS/DFS", impact: "+9% scores" },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-4 transition hover:border-primary/40 hover:shadow-elegant"
            >
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.desc}</div>
              <div className="mt-3 inline-flex rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Estimated {s.impact}</div>
              <Button size="sm" variant="outline" className="mt-3 w-full">Apply</Button>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
