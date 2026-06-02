import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, AlertTriangle, Activity, Sparkles,
  FileBarChart, Bot, Settings, GraduationCap, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/learning-gaps", label: "Learning Gaps", icon: AlertTriangle },
  { to: "/classroom", label: "Classroom Analytics", icon: Activity },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/ai-tutor", label: "AI Tutor", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display text-lg font-bold tracking-tight">
              Insight<span className="text-gradient">EDU</span>
            </div>
          </Link>
          <button className="lg:hidden text-muted-foreground" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {items.map((it) => {
            const active = pathname === it.to || pathname.startsWith(it.to + "/");
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-sidebar-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-4.5 w-4.5 shrink-0", active && "text-primary")} />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl border border-sidebar-border bg-gradient-to-br from-primary/10 to-primary-glow/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI Pro
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Unlock advanced predictions & 1-on-1 AI tutor sessions.
          </p>
          <button className="mt-3 w-full rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-90">
            Upgrade
          </button>
        </div>
      </aside>
    </>
  );
}
