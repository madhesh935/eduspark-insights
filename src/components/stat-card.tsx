import { motion } from "framer-motion";
import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  default:     { text: "text-foreground",    icon: "bg-muted/80 text-muted-foreground",     bar: "bg-muted-foreground/40", glow: "" },
  success:     { text: "text-success",       icon: "bg-success/12 text-success",             bar: "bg-success",             glow: "hover:shadow-[0_8px_24px_-8px_var(--color-success)/30]" },
  warning:     { text: "text-warning",       icon: "bg-warning/12 text-warning",             bar: "bg-warning",             glow: "hover:shadow-[0_8px_24px_-8px_var(--color-warning)/30]" },
  destructive: { text: "text-destructive",   icon: "bg-destructive/12 text-destructive",     bar: "bg-destructive",         glow: "hover:shadow-[0_8px_24px_-8px_var(--color-destructive)/30]" },
  primary:     { text: "text-primary",       icon: "bg-primary/12 text-primary",             bar: "bg-primary",             glow: "hover:shadow-glow" },
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  tone = "default",
  index = 0,
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: number;
  tone?: keyof typeof tones;
  index?: number;
  subtitle?: string;
}) {
  const t = tones[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5",
        "shadow-card transition-all duration-300 cursor-default",
        "hover:-translate-y-0.5 hover:border-border/80",
        t.glow,
      )}
    >
      {/* Hover spotlight */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      {/* Depth gradient */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent dark:from-white/[0.02]" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className={cn("mt-2 font-display text-3xl font-bold tracking-tight counter", t.text)}>
            {value}
          </div>
          {subtitle && (
            <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>

        <div className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          t.icon
        )}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
      </div>

      {delta !== undefined && (
        <div className={cn(
          "relative mt-4 flex items-center gap-1.5 text-xs font-semibold",
          delta >= 0 ? "text-success" : "text-destructive"
        )}>
          <div className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full",
            delta >= 0 ? "bg-success/12" : "bg-destructive/12"
          )}>
            {delta >= 0
              ? <TrendingUp className="h-3 w-3" />
              : <TrendingDown className="h-3 w-3" />}
          </div>
          <span>{delta >= 0 ? "+" : ""}{Math.abs(delta)}% vs last week</span>
        </div>
      )}

      {/* Accent bar at the bottom */}
      <div className={cn(
        "absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full",
        t.bar,
        "opacity-60"
      )} />
    </motion.div>
  );
}
