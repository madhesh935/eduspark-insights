import { cn } from "@/lib/utils";

export function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const cls = {
    low: "bg-success/10 text-success ring-1 ring-success/20",
    medium: "bg-warning/15 text-warning ring-1 ring-warning/25",
    high: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
  }[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        level === "low" ? "bg-success" : level === "medium" ? "bg-warning" : "bg-destructive")} />
      {level}
    </span>
  );
}
