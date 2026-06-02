import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Brain, GraduationCap, Sparkles, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InsightEDU — AI-Powered Educational Analytics" },
      { name: "description", content: "Identify learning gaps, predict student risk and deliver personalized feedback with InsightEDU." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen gradient-mesh">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Insight<span className="text-gradient">EDU</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <Link to="/login" className="hover:text-foreground transition">Sign in</Link>
        </nav>
        <Link
          to="/signup"
          className="inline-flex items-center gap-1.5 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
        >
          Get started <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" /> AI-powered learning intelligence
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Teach smarter with <span className="text-gradient">deep learning analytics</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            InsightEDU detects learning gaps before they become failures, predicts at-risk students, and generates personalized feedback — all in real time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              View live demo
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-16 max-w-6xl"
        >
          <div className="rounded-3xl border border-border bg-card/60 p-2 shadow-glow backdrop-blur-xl">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary-glow/10 p-8">
              <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { l: "Active Students", v: "192", d: "+12%" },
                  { l: "At Risk", v: "34", d: "-8%" },
                  { l: "Avg Mastery", v: "78%", d: "+5%" },
                ].map((s) => (
                  <div key={s.l} className="glass rounded-2xl p-5">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                    <div className="mt-2 font-display text-3xl font-bold">{s.v}</div>
                    <div className="mt-1 text-xs text-success">{s.d} this week</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Brain, t: "Root-cause AI", d: "Trace weak topics back to missing prerequisites with 90%+ confidence." },
            { icon: Target, t: "Risk prediction", d: "Spot at-risk students 4 weeks earlier and intervene before grades drop." },
            { icon: BarChart3, t: "Live classroom", d: "Track engagement, participation and confusion as you teach." },
            { icon: Zap, t: "Auto feedback", d: "Generate personalized notes, videos and practice in one click." },
            { icon: Sparkles, t: "AI Tutor", d: "Students get a 24/7 tutor trained on their learning history." },
            { icon: GraduationCap, t: "Reports", d: "Export student & class reports as PDF or Excel in seconds." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-6 shadow-elegant transition hover:-translate-y-1 hover:shadow-glow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2026 InsightEDU. Built for the next generation of classrooms.
      </footer>
    </div>
  );
}
