import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Sparkles, BarChart3, Brain, BookOpen, Shield, Heart, ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — InsightEDU" }] }),
  component: Login,
});

type Role = "Teacher" | "Student";

const roleDestination: Record<Role, string> = {
  Teacher: "/dashboard",
  Student: "/student-home",
};

const roleConfig: Record<Role, { icon: React.ComponentType<{ className?: string }>; desc: string; color: string; bg: string }> = {
  Teacher:  { icon: BookOpen, desc: "Teaching dashboard",        color: "text-primary border-primary bg-primary/8",        bg: "bg-primary/5" },
  Student:  { icon: GraduationCap, desc: "Learning portal",     color: "text-success border-success bg-success/8",        bg: "bg-success/5" },
};

const floatingCards = [
  {
    icon: Sparkles,
    color: "text-primary",
    iconBg: "bg-primary/15",
    title: "32 students need attention",
    sub: "AI detected Graphs learning gap",
    stats: [
      { v: "92%", l: "Confidence" },
      { v: "Recursion", l: "Root cause" },
      { v: "High", l: "Priority" },
    ],
  },
  {
    icon: BarChart3,
    color: "text-success",
    iconBg: "bg-success/15",
    title: "Class performance ↑ 18%",
    sub: "After AI-guided interventions",
    bars: [40, 55, 48, 62, 70, 68, 80, 72, 88, 82, 94],
  },
  {
    icon: Brain,
    color: "text-primary",
    iconBg: "bg-primary/15",
    title: "Root-cause detected",
    sub: "Recursion → Trees → Graphs dependency traced with 92% confidence.",
    chain: ["Recursion", "Trees", "Graphs"],
  },
];

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("Teacher");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: roleDestination[role] }), 600);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* Left — Form */}
      <div className="relative flex items-center justify-center bg-background p-6 md:p-12">
        {/* Subtle top glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-48 w-96 bg-primary/8 blur-3xl rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm space-y-7"
        >
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary shadow-glow transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <div className="font-display text-xl font-bold tracking-tight">
                Insight<span className="text-gradient">EDU</span>
              </div>
              <div className="text-[10px] text-muted-foreground">AI Learning Platform</div>
            </div>
          </Link>

          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={role}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="mt-1.5 text-sm text-muted-foreground"
              >
                Sign in to your <span className="font-medium text-foreground">{roleConfig[role].desc}</span>.
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Role selector */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">I am a…</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([r, cfg]) => {
                const Icon = cfg.icon;
                const isActive = role === r;
                return (
                  <motion.button
                    key={r}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setRole(r)}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-2xl border-2 px-3 py-2.5 text-left transition-all duration-200",
                      isActive ? cfg.color : "border-border hover:bg-accent hover:border-border/80"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="role-bg"
                        className={cn("absolute inset-0 rounded-[14px]", cfg.bg)}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <Icon className="relative h-4 w-4 shrink-0" />
                    <span className="relative text-sm font-semibold">{r}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.edu"
                className="mt-1.5 h-11 rounded-xl"
                defaultValue={role === "Teacher" ? "sara@insightedu.io" : role === "Student" ? "aanya@student.edu" : ""}
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1.5 h-11 rounded-xl" required />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <Checkbox id="remember" />
              <span>Keep me signed in</span>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl gradient-primary text-primary-foreground shadow-glow gap-2 text-sm font-semibold"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}>
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <>Sign in as {role} <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or</span></div>
          </div>

          <Button type="button" variant="outline" className="w-full h-11 rounded-xl gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.27c0-.78-.07-1.53-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.32z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create a free account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Visual showcase */}
      <div className="relative hidden overflow-hidden lg:flex items-center justify-center p-10">
        {/* Animated background */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-primary-glow/15" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md space-y-4"
        >
          {/* Headline */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">AI-Powered Learning</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Transforming how schools identify and close learning gaps
            </h2>
          </div>

          {/* Floating cards */}
          {floatingCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-2xl p-4 shadow-card hover:shadow-glow transition-shadow duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", card.iconBg)}>
                    <Icon className={cn("h-4 w-4", card.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{card.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {card.sub}
                    </div>
                  </div>
                </div>

                {card.stats && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {card.stats.map((s) => (
                      <div key={s.l} className="rounded-xl bg-background/50 px-2 py-2">
                        <div className="font-bold text-sm">{s.v}</div>
                        <div className="text-[10px] text-muted-foreground">{s.l}</div>
                      </div>
                    ))}
                  </div>
                )}

                {card.bars && (
                  <div className="mt-3 flex items-end gap-1 h-14">
                    {card.bars.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.4 + i * 0.04 }}
                        className="flex-1 rounded-t gradient-primary opacity-75"
                      />
                    ))}
                  </div>
                )}

                {card.chain && (
                  <div className="mt-3 flex items-center gap-1 flex-wrap">
                    {card.chain.map((t, i) => (
                      <div key={t} className="flex items-center gap-1">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium",
                          i === 0 ? "bg-destructive/10 text-destructive" :
                          i === 1 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                        )}>{t}</span>
                        {i < card.chain!.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-3 pt-2"
          >
            {[
              { v: "10K+", l: "Students" },
              { v: "94%", l: "Mastery rate" },
              { v: "3× faster", l: "Gap closure" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-3 text-center">
                <div className="font-display text-lg font-bold text-gradient">{s.v}</div>
                <div className="text-[10px] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
