import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, AlertTriangle, Activity, Sparkles,
  FileBarChart, Bot, Settings, GraduationCap, X,
  BookOpen, Monitor, Lightbulb, Home, Map, Heart, School,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string };

const teacherItems: NavItem[] = [
  { to: "/dashboard",               label: "Dashboard",          icon: LayoutDashboard },
  { to: "/teacher-classes",         label: "My Classes",         icon: BookOpen },
  { to: "/teacher-create-assessment", label: "Assessments",        icon: FileBarChart },
  { to: "/teacher-digital-twin",    label: "Digital Twin 🏫",    icon: Monitor,    badge: "Live" },
  { to: "/teacher-interventions",   label: "Interventions",      icon: Lightbulb,  badge: "3" },
  { to: "/learning-gaps",           label: "Learning Gaps",      icon: AlertTriangle },
  { to: "/classroom",               label: "Live Classroom",     icon: Activity },
  { to: "/ai-insights",             label: "AI Insights",        icon: Sparkles },
  { to: "/reports",                 label: "Reports",            icon: FileBarChart },
  { to: "/settings",                label: "Settings",           icon: Settings },
];

const studentItems: NavItem[] = [
  { to: "/student-home",            label: "My Dashboard",       icon: Home },
  { to: "/student-assessment",      label: "Assessments",        icon: BookOpen,   badge: "2" },
  { to: "/student-results",         label: "My Results",         icon: FileBarChart },
  { to: "/student-learning-path",   label: "Learning Path",      icon: Map },
  { to: "/student-ai-tutor",        label: "AI Tutor",           icon: Bot },
  { to: "/student-settings",        label: "Settings",           icon: Settings },
];

const parentItems: NavItem[] = [
  { to: "/parent-dashboard",        label: "My Child's Progress", icon: Heart },
  { to: "/parent-settings",         label: "Settings",            icon: Settings },
];

const adminItems: NavItem[] = [
  { to: "/admin-dashboard",         label: "Institution Analytics", icon: School },
  { to: "/dashboard",               label: "Teacher Overview",      icon: LayoutDashboard },
  { to: "/students",                label: "All Students",          icon: Users },
  { to: "/reports",                 label: "Reports",               icon: FileBarChart },
  { to: "/settings",                label: "Settings",              icon: Settings },
];

const roleConfig: Record<string, { label: string; color: string; dot: string }> = {
  Teacher:       { label: "Teacher Portal",       color: "text-primary bg-primary/10 border-primary/20",     dot: "bg-primary" },
  Student:       { label: "Student Portal",       color: "text-success bg-success/10 border-success/20",     dot: "bg-success" },
  Parent:        { label: "Parent Portal",        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",  dot: "bg-rose-500" },
  Administrator: { label: "Admin Portal",         color: "text-warning bg-warning/10 border-warning/20",     dot: "bg-warning" },
};

function getNavItems(pathname: string): { items: NavItem[]; role: string } {
  if (pathname.startsWith("/student-")) return { items: studentItems, role: "Student" };
  if (pathname.startsWith("/parent"))   return { items: parentItems,  role: "Parent" };
  if (pathname.startsWith("/admin"))    return { items: adminItems,   role: "Administrator" };
  return { items: teacherItems, role: "Teacher" };
}

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { items, role } = getNavItems(pathname);
  const rc = roleConfig[role];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
        "border-r border-sidebar-border bg-sidebar",
        "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        mobileOpen ? "translate-x-0 shadow-lifted" : "-translate-x-full",
      )}>

        {/* Decorative gradient at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />

        {/* Logo row */}
        <div className="relative flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2.5 group" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-display text-[17px] font-bold tracking-tight leading-none">
                Insight<span className="text-gradient">EDU</span>
              </div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">AI Learning Platform</div>
            </div>
          </Link>
          <button className="lg:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent transition" onClick={onClose}>
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="relative mx-3 mb-2">
          <div className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-2",
            rc.color
          )}>
            <div className={cn("h-1.5 w-1.5 rounded-full shrink-0 animate-pulse", rc.dot)} />
            <span className="text-[11px] font-semibold">{rc.label}</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="relative flex-1 overflow-y-auto px-2 py-1 scrollbar-thin space-y-0.5">
          {items.map((item) => {
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to + "/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                )}
              >
                {/* Active indicator */}
                {active && (
                  <motion.span
                    layoutId={`sidebar-pill-${role}`}
                    className="absolute inset-0 -z-10 rounded-xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                {/* Active bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                )}

                <Icon className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  active ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="flex-1 truncate">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <span className={cn(
                    "flex items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-bold min-w-[18px]",
                    item.badge === "Live"
                      ? "bg-success/15 text-success animate-pulse"
                      : "bg-primary/15 text-primary"
                  )}>
                    {item.badge}
                  </span>
                )}

                {active && (
                  <ChevronRight className="h-3 w-3 text-primary opacity-60 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

    </>
  );
}
