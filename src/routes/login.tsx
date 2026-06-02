import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles, BarChart3, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — InsightEDU" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-background p-6 md:p-10">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
          className="w-full max-w-sm space-y-6"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Insight<span className="text-gradient">EDU</span></span>
          </Link>

          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your teaching dashboard.</p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@school.edu" className="mt-1.5" required />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1.5" required />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox id="remember" /> Remember me
            </label>
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-glow">
            Sign in
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or</span></div>
          </div>

          <Button type="button" variant="outline" className="w-full gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.27c0-.78-.07-1.53-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.32z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="font-semibold text-primary hover:underline">Create account</Link>
          </p>
        </motion.form>
      </div>

      <div className="relative hidden overflow-hidden gradient-mesh lg:flex items-center justify-center p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary-glow/10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md space-y-5"
        >
          <div className="glass rounded-2xl p-6 shadow-glow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">AI Insight</div>
                <div className="font-semibold">32 students need help with Graphs</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-background/60 p-2"><div className="font-bold text-base">92%</div><div className="text-muted-foreground">Confidence</div></div>
              <div className="rounded-lg bg-background/60 p-2"><div className="font-bold text-base">Recursion</div><div className="text-muted-foreground">Root cause</div></div>
              <div className="rounded-lg bg-background/60 p-2"><div className="font-bold text-base">High</div><div className="text-muted-foreground">Priority</div></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-glow">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div className="text-sm font-semibold">Class Performance ↑ 12%</div>
            </div>
            <div className="flex h-24 items-end gap-1.5">
              {[40,55,48,62,70,68,80,72,88,82,94].map((h,i) => (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i*0.05 }} className="flex-1 rounded-t-md gradient-primary opacity-80" />
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-glow">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-semibold">Root-cause detected</div>
                <div className="text-xs text-muted-foreground">Trees → Graphs path traced back to Recursion fundamentals.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
