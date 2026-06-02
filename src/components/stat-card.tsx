import { motion } from "framer-motion";
import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, icon: Icon, delta, tone = "default", index = 0,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: number;
  tone?: "default" | "success" | "warning" | "destructive" | "primary";
  index?: number;
}) {
  const toneClass = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    primary: "text-primary",
  }[tone];

  const iconBg = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    primary: "bg-primary/10 text-primary",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-elegant transition hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className={cn("mt-2 font-display text-3xl font-bold tracking-tight", toneClass)}>{value}</div>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta !== undefined && (
        <div className={cn("mt-3 inline-flex items-center gap-1 text-xs font-medium",
          delta >= 0 ? "text-success" : "text-destructive")}>
          {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(delta)}% vs last week
        </div>
      )}
    </motion.div>
  );
}
