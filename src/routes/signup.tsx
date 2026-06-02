import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — InsightEDU" }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"Teacher" | "Student" | "Admin">("Teacher");
  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4 md:p-8">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
        className="glass w-full max-w-lg space-y-5 rounded-3xl p-8 shadow-glow"
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Insight<span className="text-gradient">EDU</span></span>
        </Link>

        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start free — no credit card required.</p>
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

        <div>
          <Label>Role</Label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(["Teacher","Student","Admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn("rounded-xl border px-3 py-2 text-sm font-medium transition",
                  role === r
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-accent")}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-glow">
          Create account
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </motion.form>
    </div>
  );
}
