import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Sparkles, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { interventions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/teacher-interventions")({
  head: () => ({ meta: [{ title: "Interventions — InsightEDU" }] }),
  component: InterventionsPage,
});

function InterventionsPage() {
  const [items, setItems] = useState(interventions);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "dismissed">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = items.filter((i) => filter === "all" || i.status === filter);

  const act = (id: string, status: "approved" | "dismissed") => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">AI Interventions</h1>
        <p className="text-sm text-muted-foreground">Review and approve AI-suggested interventions for at-risk students.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", count: items.filter((i) => i.status === "pending").length, color: "text-warning", bg: "bg-warning/10" },
          { label: "Approved", count: items.filter((i) => i.status === "approved").length, color: "text-success", bg: "bg-success/10" },
          { label: "Dismissed", count: items.filter((i) => i.status === "dismissed").length, color: "text-muted-foreground", bg: "bg-muted/40" },
        ].map((s) => (
          <GlassCard key={s.label}>
            <div className="text-center">
              <div className={cn("font-display text-3xl font-bold", s.color)}>{s.count}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all","pending","approved","dismissed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition",
              filter === f ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"
            )}>
            {f}
          </button>
        ))}
      </div>

      {/* Intervention Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.04 }}>
              <GlassCard className={cn(
                "transition-all",
                item.status === "approved" && "border-success/30 bg-success/5",
                item.status === "dismissed" && "opacity-50",
                item.priority === "high" && item.status === "pending" && "border-destructive/30"
              )}>
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.studentName}`} />
                    <AvatarFallback>{item.studentName.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{item.studentName}</span>
                      <Badge variant={item.priority === "high" ? "destructive" : "secondary"} className="text-[10px]">
                        {item.priority} priority
                      </Badge>
                      {item.status !== "pending" && (
                        <Badge className={cn("text-[10px]", item.status === "approved" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                          {item.status === "approved" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                          {item.status}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.weakTopics.map((t) => (
                        <span key={t} className="rounded-full bg-destructive/10 text-destructive text-[10px] px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      Root cause: <span className="font-medium text-foreground ml-1">{item.rootCause}</span>
                    </div>

                    {/* Suggestions (collapsible) */}
                    <AnimatePresence>
                      {expanded === item.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 space-y-2 overflow-hidden">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-primary" /> AI-Suggested Actions
                          </div>
                          {item.suggestions.map((s, j) => (
                            <div key={j} className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-transparent p-3">
                              <div className="text-sm font-medium">{s.action}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{s.detail}</div>
                              <div className="mt-2 inline-flex rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                                Estimated {s.impact}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                        {expanded === item.id ? "Hide" : "View"} suggestions
                        <ChevronRight className={cn("h-3 w-3 transition-transform", expanded === item.id && "rotate-90")} />
                      </button>
                      {item.status === "pending" && (
                        <div className="ml-auto flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => act(item.id, "dismissed")} className="text-xs h-7 gap-1 text-muted-foreground hover:text-destructive hover:border-destructive/40">
                            <XCircle className="h-3 w-3" /> Dismiss
                          </Button>
                          <Button size="sm" onClick={() => act(item.id, "approved")} className="text-xs h-7 gradient-primary text-primary-foreground gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <Clock className="mx-auto h-10 w-10 opacity-30 mb-3" />
            <div>No interventions in this category.</div>
          </div>
        )}
      </div>
    </div>
  );
}
