import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function GlassCard({
  className, children, title, description, action, ...props
}: HTMLAttributes<HTMLDivElement> & { title?: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-elegant", className)} {...props}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
          <div>
            {title && <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
