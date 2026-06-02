import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Play, Pause, ChevronLeft, ChevronRight, Maximize2, Sparkles,
  BookOpen, Users, Brain, Target, CheckCircle2, TrendingUp, ArrowRight, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDigitalTwinData } from "@/lib/mock-data";

export const Route = createFileRoute("/demo")({
  head: () => ({ meta: [{ title: "InsightEDU — Live Demo" }] }),
  component: DemoPage,
});

// ─── Scene definitions ─────────────────────────────────────────

const scenes = [
  {
    id: 1,
    icon: "📝",
    title: "Teacher Creates Assessment",
    subtitle: "Step 1 of 7",
    accent: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
  },
  {
    id: 2,
    icon: "🧑‍💻",
    title: "Students Take the Test",
    subtitle: "Step 2 of 7",
    accent: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30",
  },
  {
    id: 3,
    icon: "🧠",
    title: "AI Analyses Responses",
    subtitle: "Step 3 of 7",
    accent: "from-primary/20 to-primary-glow/10",
    border: "border-primary/30",
  },
  {
    id: 4,
    icon: "🔍",
    title: "Learning Gap Detected",
    subtitle: "Step 4 of 7",
    accent: "from-orange-500/20 to-red-500/10",
    border: "border-orange-500/30",
  },
  {
    id: 5,
    icon: "🌳",
    title: "Root Cause Identified",
    subtitle: "Step 5 of 7",
    accent: "from-red-500/20 to-rose-500/10",
    border: "border-red-500/30",
  },
  {
    id: 6,
    icon: "💡",
    title: "Recommendations Generated",
    subtitle: "Step 6 of 7",
    accent: "from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/30",
  },
  {
    id: 7,
    icon: "📈",
    title: "Progress Improves",
    subtitle: "Step 7 of 7",
    accent: "from-green-500/20 to-emerald-500/10",
    border: "border-green-500/30",
  },
];

// ─── Scene Content Components ────────────────────────────────

function Scene1() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((v) => Math.min(v + 1, 3)), 600);
    return () => clearInterval(t);
  }, []);
  const fields = [
    { label: "Quiz Name", value: "Trees and Graphs Quiz" },
    { label: "Subject", value: "Computer Science" },
    { label: "Duration", value: "30 Minutes" },
    { label: "Questions", value: "20 (AI-tagged)" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        {fields.map((f, i) => (
          <motion.div key={f.label} initial={{ opacity: 0, x: -10 }} animate={step > i ? { opacity: 1, x: 0 } : {}} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{f.label}</span>
            <span className="font-semibold">{step > i ? f.value : "..."}</span>
          </motion.div>
        ))}
      </div>
      {step >= 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-success/30 bg-success/10 p-3 text-center text-sm font-semibold text-success">
          ✅ Assessment Published to 60 Students
        </motion.div>
      )}
    </div>
  );
}

function Scene2() {
  const seats = getDigitalTwinData("c1");
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFilled((v) => Math.min(v + 3, 60)), 80);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Students joined</span>
        <span className="font-bold text-primary">{filled} / 60</span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 60 }, (_, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={i < filled ? { scale: 1 } : {}} transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={cn("h-6 w-6 rounded-md", i < filled ? "bg-primary/70" : "bg-muted/30")} />
        ))}
      </div>
      <div className="text-xs text-muted-foreground text-center">Each student answers + rates confidence after every question</div>
    </div>
  );
}

function Scene3() {
  const [progress, setProgress] = useState(0);
  const topics = ["Arrays 90%", "Linked Lists 85%", "Stacks 80%", "Recursion 42%", "Trees 38%", "Graphs 35%"];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const p = setInterval(() => setProgress((v) => Math.min(v + 2, 100)), 30);
    const s = setInterval(() => setShown((v) => Math.min(v + 1, topics.length)), 400);
    return () => { clearInterval(p); clearInterval(s); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Analysing {60} student responses…</span><span>{progress}%</span></div>
        <div className="h-3 rounded-full bg-muted overflow-hidden"><motion.div animate={{ width: `${progress}%` }} className="h-full gradient-primary rounded-full" /></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {topics.slice(0, shown).map((t, i) => {
          const score = parseInt(t.split(" ")[1]);
          return (
            <motion.div key={t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs">
              <div className={cn("h-2 w-2 rounded-full shrink-0", score >= 70 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-destructive")} />
              <span className="flex-1 text-muted-foreground">{t.split(" ")[0]}</span>
              <span className={cn("font-bold", score >= 70 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive")}>{t.split(" ")[1]}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Scene4() {
  const gaps = ["Recursion", "Trees", "Graphs"];
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => Math.min(v + 1, gaps.length)), 500);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "At Risk", value: "38", color: "text-destructive" },
          { label: "Gap Topics", value: "3", color: "text-warning" },
          { label: "AI Confidence", value: "92%", color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-muted/60 p-3 text-center">
            <div className={cn("font-display text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 space-y-2">
        <div className="text-xs font-semibold text-destructive uppercase tracking-wider">Learning Gaps Detected</div>
        {gaps.slice(0, visible).map((g, i) => (
          <motion.div key={g} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            <span className="font-medium">{g}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${85 - i * 15}%` }} className="h-full bg-destructive" />
            </div>
            <span className="text-xs text-destructive">{85 - i * 15}% struggling</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Scene5() {
  const chain = ["Programming Fundamentals", "Functions", "Recursion", "Trees", "Graphs"];
  const weak = ["Recursion", "Trees", "Graphs"];
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => Math.min(v + 1, chain.length)), 450);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col items-center gap-1.5">
      {chain.slice(0, visible).map((t, i) => (
        <div key={t}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300 }}
            className={cn("rounded-2xl border-2 px-5 py-2 text-sm font-semibold flex items-center gap-2",
              t === "Recursion" ? "border-destructive bg-destructive/10 text-destructive shadow-lg"
              : weak.includes(t) ? "border-warning bg-warning/10 text-warning"
              : "border-success bg-success/10 text-success"
            )}>
            {t === "Recursion" && <AlertTriangle className="h-4 w-4" />}
            {!weak.includes(t) && <CheckCircle2 className="h-4 w-4" />}
            {t}
            {t === "Recursion" && <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-bold">ROOT CAUSE</span>}
          </motion.div>
          {i < chain.slice(0, visible).length - 1 && <div className="flex justify-center h-4"><div className="w-px bg-border" /></div>}
        </div>
      ))}
    </div>
  );
}

function Scene6() {
  const recs = [
    { icon: "🎬", title: "Watch Recursion Video", impact: "+12% mastery" },
    { icon: "📝", title: "Complete Practice Set", impact: "+18% score" },
    { icon: "✅", title: "Retake Mini-Assessment", impact: "+9% confidence" },
  ];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShown((v) => Math.min(v + 1, recs.length)), 500);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-3">
      {recs.slice(0, shown).map((r, i) => (
        <motion.div key={r.title} initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring" }}
          className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 to-transparent p-4 flex items-center gap-4">
          <div className="text-2xl">{r.icon}</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{r.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Assigned to 38 struggling students</div>
          </div>
          <span className="rounded-full bg-success/10 text-success text-[10px] px-2 py-0.5 font-semibold">{r.impact}</span>
        </motion.div>
      ))}
      {shown >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-success/10 border border-success/20 p-3 text-xs text-success text-center font-semibold">
          ✅ Teacher approved all 3 interventions
        </motion.div>
      )}
    </div>
  );
}

function Scene7() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProgress((v) => Math.min(v + 1, 100)), 25);
    return () => clearInterval(t);
  }, []);
  const before = [35, 38, 42];
  const after = [72, 75, 78];
  const labels = ["Recursion", "Trees", "Graphs"];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {labels.map((l, i) => {
          const val = Math.round(before[i] + (after[i] - before[i]) * (progress / 100));
          return (
            <div key={l} className="rounded-xl bg-muted/60 p-3 text-center">
              <div className={cn("font-display text-xl font-bold", val >= 70 ? "text-success" : val >= 50 ? "text-warning" : "text-destructive")}>{val}%</div>
              <div className="text-[10px] text-muted-foreground">{l}</div>
              <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div animate={{ width: `${val}%` }} className={cn("h-full rounded-full", val >= 70 ? "bg-success" : val >= 50 ? "bg-warning" : "bg-destructive")} />
              </div>
            </div>
          );
        })}
      </div>
      {progress >= 80 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-success/30 bg-success/10 p-4 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-display font-bold text-success">Average mastery improved from 38% → 75%</div>
          <div className="text-xs text-muted-foreground mt-1">In just 1 week of personalised learning</div>
        </motion.div>
      )}
    </div>
  );
}

const sceneComponents = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];

function DemoPage() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrent((v) => {
          if (v >= scenes.length - 1) { setIsPlaying(false); return v; }
          return v + 1;
        });
      }, 5000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying]);

  const scene = scenes[current];
  const SceneContent = sceneComponents[current];

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">Insight<span className="text-gradient">EDU</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground hidden sm:block">
            Live Platform Demo · {current + 1} / {scenes.length}
          </div>
          <Link to="/dashboard">
            <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow gap-1.5">
              Try Live Platform <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Scene step pills */}
          <div className="flex gap-1.5 justify-center flex-wrap">
            {scenes.map((s, i) => (
              <button key={s.id} onClick={() => { setCurrent(i); setIsPlaying(false); }}
                className={cn("h-1.5 rounded-full transition-all", i === current ? "w-8 bg-primary" : i < current ? "w-4 bg-primary/40" : "w-4 bg-muted/60")} />
            ))}
          </div>

          {/* Main scene card */}
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
              className={cn("rounded-3xl border-2 p-6 md:p-8 shadow-glow backdrop-blur-xl bg-gradient-to-br", scene.accent, scene.border)}
            >
              {/* Scene header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">{scene.icon}</div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">{scene.subtitle}</div>
                  <h2 className="font-display text-xl font-bold">{scene.title}</h2>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> AI-Powered
                </div>
              </div>

              {/* Scene content */}
              <SceneContent key={`scene-${current}`} />
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="icon" onClick={() => { setCurrent((v) => Math.max(v - 1, 0)); setIsPlaying(false); }} disabled={current === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsPlaying(!isPlaying)} className={cn("gap-2 min-w-28", isPlaying ? "border-border bg-card" : "gradient-primary text-primary-foreground shadow-glow")} variant={isPlaying ? "outline" : "default"}>
              {isPlaying ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Auto-Play</>}
            </Button>
            <Button variant="outline" size="icon" onClick={() => { setCurrent((v) => Math.min(v + 1, scenes.length - 1)); setIsPlaying(false); }} disabled={current === scenes.length - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Step labels */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {scenes.map((s, i) => (
              <button key={s.id} onClick={() => { setCurrent(i); setIsPlaying(false); }}
                className={cn("flex flex-col items-center gap-1 rounded-xl p-1.5 transition", i === current ? "bg-primary/10" : "hover:bg-accent/40")}>
                <div className="text-base">{s.icon}</div>
                <div className={cn("text-[9px] leading-tight", i === current ? "text-primary font-semibold" : "text-muted-foreground")}>{s.title.split(" ").slice(0, 2).join(" ")}</div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">InsightEDU</span> — AI-Powered Educational Ecosystem · Built for the next generation of classrooms
          </div>
        </div>
      </div>
    </div>
  );
}
