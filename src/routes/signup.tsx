import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, GraduationCap as StudentIcon, Shield, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — InsightEDU" }] }),
  component: Signup,
});

type Role = "Teacher" | "Student" | "Admin" | "Parent";

const roleDestination: Record<Role, string> = {
  Teacher: "/teacher-classes",
  Admin: "/admin-dashboard",
  Student: "/student-home",
  Parent: "/parent-dashboard",
};

const roleConfig: Record<Role, { icon: React.ComponentType<{ className?: string }>; desc: string; color: string }> = {
  Teacher: { icon: BookOpen, desc: "Manage classes, create assessments, view insights", color: "border-primary bg-primary/10 text-primary" },
  Student: { icon: StudentIcon, desc: "Take assessments, view your learning path", color: "border-success bg-success/10 text-success" },
  Admin: { icon: Shield, desc: "Institution analytics and oversight", color: "border-warning bg-warning/10 text-warning" },
  Parent: { icon: Heart, desc: "Track your child's progress and get AI summaries", color: "border-destructive bg-destructive/10 text-destructive" },
};

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("Teacher");

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4 md:p-8">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={(e) => { e.preventDefault(); navigate({ to: roleDestination[role] }); }}
        className="glass w-full max-w-lg space-y-5 rounded-3xl p-8 shadow-glow"
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Insight<span className="text-gradient">EDU</span></span>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Join InsightEDU</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start free — no credit card required.</p>
        </div>

        {/* Role selector — cards with icons */}
        <div>
          <Label>I am a…</Label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([r, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={r}
                  type="button"
                  id={`role-${r.toLowerCase()}`}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-2xl border-2 px-3 py-3 text-left transition-all",
                    role === r ? cfg.color : "border-border hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <div className="text-sm font-semibold">{r}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{cfg.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Sara Rao" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@school.edu" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="inst">Institution</Label>
            <Input id="inst" placeholder="Lincoln High School" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="cpw">Confirm password</Label>
            <Input id="cpw" type="password" className="mt-1.5" required />
          </div>
        </div>

        <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-glow">
          Create account as {role}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </motion.form>
    </div>
  );
}
