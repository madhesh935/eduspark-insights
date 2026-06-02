import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Render the card with a glowing primary border accent */
  glow?: boolean;
  /** Skip the animation (for lists where parent animates) */
  noAnimate?: boolean;
  /** Remove the inner content padding */
  flush?: boolean;
}

export function GlassCard({
  className,
  children,
  title,
  description,
  action,
  glow = false,
  noAnimate = false,
  flush = false,
  ...props
}: GlassCardProps) {
  const Wrapper = noAnimate ? "div" : motion.div;
  const animProps = noAnimate
    ? {}
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <Wrapper
      // @ts-expect-error motion attrs
      {...animProps}
      className={cn(
        // Base card
        "group relative overflow-hidden rounded-2xl border bg-card",
        // Shadow & hover
        "shadow-card transition-all duration-300",
        "hover:shadow-elegant hover:-translate-y-px",
        // Glow variant
        glow
          ? "border-primary/30 shadow-glow"
          : "border-border",
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent dark:from-white/[0.03]" />

      {/* Header */}
      {(title || action) && (
        <div className="relative flex items-start justify-between gap-3 border-b border-border/50 px-5 py-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="font-display text-sm font-semibold tracking-tight text-foreground leading-snug">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="shrink-0 mt-0.5">{action}</div>
          )}
        </div>
      )}

      {/* Body */}
      <div className={cn("relative", !flush && "p-5")}>
        {children}
      </div>
    </Wrapper>
  );
}
