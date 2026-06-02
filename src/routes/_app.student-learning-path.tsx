import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Lock, Play, BookOpen, Clock, ArrowRight, Sparkles, TrendingUp,
  ChevronDown, ChevronUp, Star, Target, Flame, Trophy, Bot, AlertTriangle, Lightbulb,
  Zap, BrainCircuit, Activity, BarChart3, Medal, Video, HelpCircle, FileText, Download, CheckSquare,
  Calendar, Users, Layers, Headphones
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { students, achievements } from "@/lib/mock-data";
import { generateLearningPath } from "@/lib/ai-engine";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid
} from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/student-learning-path")({
  head: () => ({ meta: [{ title: "Learning Path — InsightEDU" }] }),
  component: LearningPathPage,
});

const myStudent = students.find(s => s.risk === "high") ?? students[0];
const path = generateLearningPath(myStudent);

// Extended resources for rich module expansion
const resources: Record<string, { icon: React.ReactNode; label: string; duration: string; type: "video" | "practice" | "read" | "quiz" | "interactive"; status: "completed" | "current" | "locked" }[]> = {
  "Recursion Basics": [
    { icon: <Video className="h-4 w-4"/>, label: "Mastering Recursion in 15 Minutes", duration: "15 min", type: "video", status: "completed" },
    { icon: <FileText className="h-4 w-4"/>, label: "Interactive Notes: Call Stack", duration: "10 min", type: "interactive", status: "completed" },
    { icon: <Activity className="h-4 w-4"/>, label: "Practice: 10 basic problems", duration: "25 min", type: "practice", status: "current" },
    { icon: <HelpCircle className="h-4 w-4"/>, label: "Mini-quiz: Recursion check", duration: "10 min", type: "quiz", status: "locked" },
  ],
  "Recursive Problems": [
    { icon: <Video className="h-4 w-4"/>, label: "Video: Fibonacci & Factorials", duration: "15 min", type: "video", status: "locked" },
    { icon: <Activity className="h-4 w-4"/>, label: "Practice: 15 recursion problems", duration: "40 min", type: "practice", status: "locked" },
    { icon: <HelpCircle className="h-4 w-4"/>, label: "Mini-quiz: 10 questions", duration: "12 min", type: "quiz", status: "locked" },
  ],
  "Tree Traversal": [
    { icon: <Video className="h-4 w-4"/>, label: "Video: Inorder, Preorder, Postorder", duration: "18 min", type: "video", status: "locked" },
    { icon: <Activity className="h-4 w-4"/>, label: "Practice: Tree traversal coding", duration: "35 min", type: "practice", status: "locked" },
    { icon: <HelpCircle className="h-4 w-4"/>, label: "Mini-quiz: Tree properties", duration: "10 min", type: "quiz", status: "locked" },
  ],
  "Binary Search Trees": [
    { icon: <Video className="h-4 w-4"/>, label: "Video: BST Operations", duration: "20 min", type: "video", status: "locked" },
    { icon: <Activity className="h-4 w-4"/>, label: "Practice: Insert, Search, Delete", duration: "45 min", type: "practice", status: "locked" },
    { icon: <HelpCircle className="h-4 w-4"/>, label: "Assessment: BST mastery check", duration: "15 min", type: "quiz", status: "locked" },
  ],
  "Graphs": [
    { icon: <Video className="h-4 w-4"/>, label: "Video: BFS and DFS explained", duration: "22 min", type: "video", status: "locked" },
    { icon: <Activity className="h-4 w-4"/>, label: "Practice: Graph traversal", duration: "50 min", type: "practice", status: "locked" },
    { icon: <HelpCircle className="h-4 w-4"/>, label: "Final assessment: Graphs", duration: "20 min", type: "quiz", status: "locked" },
  ],
};

const moduleMeta: Record<string, { diff: string; prereqs: string[]; outcomes: string[]; vids: number; prac: number; quiz: number }> = {
  "Recursion Basics": { diff: "Beginner", prereqs: ["Functions", "Loops"], outcomes: ["Understand base cases", "Visualize call stack"], vids: 1, prac: 1, quiz: 1 },
  "Recursive Problems": { diff: "Intermediate", prereqs: ["Recursion Basics"], outcomes: ["Solve DP overlapping subproblems", "Write clean recursive relations"], vids: 1, prac: 1, quiz: 1 },
  "Tree Traversal": { diff: "Intermediate", prereqs: ["Recursion Basics"], outcomes: ["Traverse n-ary trees", "Understand DFS conceptually"], vids: 1, prac: 1, quiz: 1 },
  "Binary Search Trees": { diff: "Advanced", prereqs: ["Tree Traversal"], outcomes: ["Implement BST from scratch", "O(log n) search bounds"], vids: 1, prac: 1, quiz: 1 },
  "Graphs": { diff: "Advanced", prereqs: ["Tree Traversal"], outcomes: ["Model networks", "BFS vs DFS tradeoffs"], vids: 1, prac: 1, quiz: 1 },
};

const masteryByTopic: Record<string, number> = {
  "Recursion Basics":    41,
  "Recursive Problems":  41,
  "Tree Traversal":      38,
  "Binary Search Trees": 38,
  "Graphs":              35,
};

const heatTopics = [
  { topic: "Arrays",       mastery: 90, status: "strong" },
  { topic: "Linked Lists", mastery: 82, status: "strong" },
  { topic: "Stacks",       mastery: 75, status: "strong" },
  { topic: "Queues",       mastery: 68, status: "average" },
  { topic: "Trees",        mastery: 38, status: "weak" },
  { topic: "Graphs",       mastery: 35, status: "weak" },
];

function LearningPathPage() {
  const [completedSteps] = useState(0); // For demo, let's say 0 full modules completed, but currently in the first one.
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });
  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: 1, label: "Complete Recursion Module", done: false },
    { id: 2, label: "Watch 2 Videos", done: true },
    { id: 3, label: "Solve 10 Practice Questions", done: false },
    { id: 4, label: "Attempt Mini Assessment", done: false },
  ]);

  const toggle = (i: number) => setExpanded(p => ({ ...p, [i]: !p[i] }));
  const totalMins = path.reduce((a, s) => a + parseInt(s.estimatedTime), 0);
  const goalsCompleted = weeklyGoals.filter(g => g.done).length;

  return (
    <div className="space-y-6">
      {/* Premium Motivational Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-8">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-warning/20 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow shrink-0">
              <BrainCircuit className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-foreground">
                Your AI Learning Path
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                "You're closer than 78% of students to mastering Trees. Only 2 more modules to unlock Graph Algorithms. Keep your 5-day streak alive!"
              </p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button className="gradient-primary text-primary-foreground shadow-glow gap-2 rounded-full px-6">
              <Play className="h-4 w-4 fill-current" /> Resume Learning
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 2-Column Intelligent Layout */}
      <div className="grid gap-6 lg:grid-cols-[7fr_3fr]">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: CORE LEARNING JOURNEY                             */}
        {/* ============================================================== */}
        <div className="space-y-6">
          
          {/* AI Root Cause Visualization (Interactive Graph) */}
          <GlassCard title="Knowledge Dependency Graph" description="How your concepts connect and where the block is" action={<Sparkles className="h-4 w-4 text-primary" />}>
            <div className="relative py-8 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-muted/20 border border-border/50">
              {/* Connecting line */}
              <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-success via-destructive to-destructive opacity-30 left-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-4 group">
                  <div className="flex-1 text-right text-xs font-semibold text-success uppercase tracking-wider group-hover:text-success/80 transition-colors">Mastered</div>
                  <div className="h-10 w-10 rounded-full bg-success/20 border-2 border-success flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1 text-left font-display font-bold text-lg text-foreground">Functions</div>
                </motion.div>

                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 group">
                  <div className="flex-1 text-right text-xs font-semibold text-destructive uppercase tracking-wider">Root Cause</div>
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full bg-destructive/20 animate-ping opacity-75" />
                    <div className="h-10 w-10 relative z-10 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                  </div>
                  <div className="flex-1 text-left font-display font-bold text-lg text-foreground">Recursion</div>
                </motion.div>

                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 opacity-70">
                  <div className="flex-1 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Blocked</div>
                  <div className="h-10 w-10 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left font-display font-bold text-lg text-muted-foreground">Trees</div>
                </motion.div>

                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 opacity-50">
                  <div className="flex-1 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Blocked</div>
                  <div className="h-10 w-10 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left font-display font-bold text-lg text-muted-foreground">Graphs</div>
                </motion.div>
              </div>
            </div>
          </GlassCard>

          {/* Enhanced Learning Path Timeline (Duolingo / Roadmap.sh style) */}
          <GlassCard title="Your Journey" description="Step-by-step path to mastery" action={<Activity className="h-4 w-4 text-primary" />}>
            <div className="relative mt-4">
              {/* Thick Timeline Connector */}
              <div className="absolute left-8 top-8 bottom-12 w-2 rounded-full bg-muted overflow-hidden">
                <motion.div animate={{ height: `${(completedSteps / path.length) * 100}%` }} className="w-full bg-gradient-to-b from-primary to-primary-glow" />
              </div>

              <div className="space-y-8">
                {path.map((step, i) => {
                  const isCompleted = i < completedSteps;
                  const isCurrent   = i === completedSteps;
                  const isLocked    = i > completedSteps;
                  const meta        = moduleMeta[step.topic] || moduleMeta["Recursion Basics"];
                  const stepRes     = resources[step.topic] || resources["Recursion Basics"];
                  const mastery     = masteryByTopic[step.topic] ?? 0;
                  const isOpen      = !!expanded[i];

                  return (
                    <motion.div key={step.topic} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative pl-20">
                      
                      {/* Timeline Node */}
                      <div className={cn(
                        "absolute left-4 top-4 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 z-10 transition-all duration-300",
                        isCompleted ? "bg-success border-background text-primary-foreground shadow-[0_0_0_4px_var(--success)]" :
                        isCurrent   ? "bg-primary border-background text-primary-foreground shadow-[0_0_0_4px_var(--primary)] animate-pulse" :
                        "bg-muted border-background text-muted-foreground shadow-[0_0_0_4px_var(--muted)]"
                      )}>
                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : <span className="font-bold">{i+1}</span>}
                      </div>

                      {/* Module Card */}
                      <div className={cn(
                        "rounded-2xl border transition-all duration-300 overflow-hidden",
                        isCompleted ? "border-success/30 bg-success/5 hover:border-success/50 hover:shadow-success/10" :
                        isCurrent   ? "border-primary/40 bg-gradient-to-br from-primary/10 to-background shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary" :
                        "border-border/50 bg-card/40 opacity-80 hover:opacity-100 hover:border-border"
                      )}>
                        
                        {/* Always visible header */}
                        <button className="w-full text-left p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-2xl" onClick={() => !isLocked && toggle(i)}>
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 flex-wrap mb-2">
                                <h3 className="font-display font-bold text-xl">{step.topic}</h3>
                                {isCurrent   && <Badge className="bg-primary text-primary-foreground shadow-glow border-none uppercase text-[10px] tracking-wider px-2 py-0.5">Current Module</Badge>}
                                {isCompleted && <Badge className="bg-success/20 text-success border-success/30 uppercase text-[10px] tracking-wider px-2 py-0.5">Completed</Badge>}
                                {isLocked    && <Badge variant="secondary" className="uppercase text-[10px] tracking-wider px-2 py-0.5"><Lock className="h-3 w-3 mr-1 inline"/> Locked</Badge>}
                              </div>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground font-medium">
                                <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> {meta.diff}</span>
                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {step.estimatedTime}</span>
                                <span className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" /> {meta.vids} Video</span>
                                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> {meta.prac} Practice</span>
                                <span className="flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5" /> {meta.quiz} Quiz</span>
                              </div>

                              {/* Progress / Mastery Bar */}
                              <div className="mt-4 flex items-center gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-16">Mastery</span>
                                <div className="flex-1 max-w-[200px] h-2 rounded-full bg-muted overflow-hidden">
                                  <motion.div initial={{ width:0 }} animate={{ width:`${mastery}%` }} transition={{ duration:1, delay:0.2 }}
                                    className={cn("h-full rounded-full", mastery>=75?"bg-success":mastery>=40?"gradient-primary":"bg-destructive")} />
                                </div>
                                <span className={cn("text-xs font-bold", mastery>=75?"text-success":mastery>=40?"text-primary":"text-destructive")}>{mastery}%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0">
                              {isCurrent && (
                                <Button className="gradient-primary text-primary-foreground shadow-glow gap-2 rounded-xl">
                                  <Play className="h-4 w-4 fill-current" /> Start
                                </Button>
                              )}
                              {!isLocked && (
                                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-colors", isOpen ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
                                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Expanded Module Details (Tabs) */}
                        <AnimatePresence>
                          {isOpen && !isLocked && (
                            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} className="overflow-hidden border-t border-border/50 bg-card/30">
                              <Tabs defaultValue="overview" className="w-full">
                                <div className="px-5 pt-2 overflow-x-auto scrollbar-none">
                                  <TabsList className="bg-transparent border-b border-border/40 rounded-none w-full justify-start h-auto p-0 space-x-6">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-xs uppercase tracking-wider font-semibold">Overview</TabsTrigger>
                                    <TabsTrigger value="activities" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-xs uppercase tracking-wider font-semibold">Learning Activities</TabsTrigger>
                                    <TabsTrigger value="ai-tutor" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"><Bot className="h-3.5 w-3.5"/> AI Tutor</TabsTrigger>
                                  </TabsList>
                                </div>

                                <div className="p-5">
                                  <TabsContent value="overview" className="mt-0 space-y-4 focus-visible:outline-none">
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2"><BookOpen className="h-4 w-4 text-primary"/> Learning Outcomes</h4>
                                        <ul className="space-y-1.5 text-muted-foreground">
                                          {meta.outcomes.map((o, idx) => <li key={idx} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5"/> <span>{o}</span></li>)}
                                        </ul>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2"><ArrowRight className="h-4 w-4 text-warning"/> Prerequisites</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {meta.prereqs.map((p, idx) => <Badge key={idx} variant="outline" className="bg-background text-xs font-medium">{p} <CheckCircle2 className="h-3 w-3 text-success ml-1 inline"/></Badge>)}
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="activities" className="mt-0 focus-visible:outline-none">
                                    <div className="space-y-3">
                                      {stepRes.map((r, j) => (
                                        <div key={j} className="group flex items-center gap-4 rounded-xl border border-border/40 bg-background/50 px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                                          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shadow-sm shrink-0", 
                                            r.status === "completed" ? "bg-success/20 text-success" : 
                                            r.status === "current" ? "bg-primary text-primary-foreground shadow-glow" : 
                                            "bg-muted text-muted-foreground"
                                          )}>
                                            {r.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : r.icon}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className={cn("font-medium text-sm truncate", r.status === "locked" && "text-muted-foreground")}>{r.label}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                              <Badge variant="secondary" className="text-[9px] uppercase tracking-wider px-1.5 py-0">{r.type}</Badge>
                                              <span>{r.duration}</span>
                                            </div>
                                          </div>
                                          {r.status === "current" && <Button size="sm" className="shrink-0 h-8 text-xs gradient-primary shadow-glow">Start</Button>}
                                          {r.status === "completed" && <Badge variant="outline" className="text-[10px] text-success border-success/30 bg-success/10">Done</Badge>}
                                          {r.status === "locked" && <Lock className="h-4 w-4 text-muted-foreground opacity-50" />}
                                        </div>
                                      ))}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="ai-tutor" className="mt-0 focus-visible:outline-none">
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col md:flex-row gap-4 items-center">
                                      <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary shadow-glow shrink-0">
                                        <Bot className="h-6 w-6 text-primary-foreground" />
                                      </div>
                                      <div className="flex-1 text-center md:text-left">
                                        <h4 className="font-semibold text-sm">Stuck on this module?</h4>
                                        <p className="text-xs text-muted-foreground mt-1">The AI tutor knows your learning history and can explain {step.topic} concepts step-by-step.</p>
                                      </div>
                                      <Link to="/student-ai-tutor" className="shrink-0 w-full md:w-auto">
                                        <Button variant="outline" className="w-full gap-2 border-primary/30 hover:bg-primary/10">
                                          Ask AI Tutor <ArrowRight className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </div>
                                  </TabsContent>
                                </div>
                              </Tabs>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassCard>

          {/* ── 1. LEARNING GAP BREAKDOWN ─────────────────────────── */}
          <GlassCard title="Learning Gap Analysis" description="AI-generated breakdown of your weakest areas" action={<AlertTriangle className="h-4 w-4 text-destructive" />}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Weak Topics</div>
                {[
                  { topic: "Recursion", pct: 42 },
                  { topic: "Trees",     pct: 38 },
                  { topic: "Graphs",    pct: 35 },
                ].map((t, i) => (
                  <div key={t.topic}>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span>{t.topic}</span>
                      <span className="text-destructive">{t.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ duration: 1, delay: i * 0.15 }}
                        className="h-full bg-destructive rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <div className="text-[10px] font-bold text-destructive uppercase tracking-wider">Root Cause</div>
                  <div className="font-display font-bold text-xl mt-0.5">Recursion Fundamentals</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/40 p-3">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Impact</div>
                    <div className="font-bold text-sm mt-0.5">3 Topics Blocked</div>
                  </div>
                  <div className="rounded-xl bg-success/10 border border-success/20 p-3">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recovery</div>
                    <div className="font-bold text-success text-sm mt-0.5">5 Hours</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ── 2. IMPROVEMENT JOURNEY ───────────────────────────── */}
          <GlassCard title="Improvement Journey" description="Your score progression across assessments"
            action={<Badge className="bg-success/15 text-success border-success/30 text-[10px] uppercase font-bold">↑ +29% Overall</Badge>}>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: "Assessment 1", score: 52 },
                  { name: "Assessment 2", score: 68 },
                  { name: "Assessment 3", score: 81 },
                ]} margin={{ left: -20, right: 8, top: 10 }}>
                  <defs>
                    <linearGradient id="lp-journey" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(222,90%,55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(222,90%,55%)" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[40, 100]} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, "Score"]} />
                  <Area type="monotone" dataKey="score" stroke="hsl(222,90%,55%)" strokeWidth={2.5}
                    fill="url(#lp-journey)"
                    dot={{ fill: "hsl(222,90%,55%)", r: 6, strokeWidth: 2, stroke: "var(--background)" }}
                    activeDot={{ r: 8 }}
                    label={{ position: "top", fontSize: 12, fontWeight: 700, fill: "hsl(222,90%,55%)", formatter: (v: number) => `${v}%` }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* ── 3. SKILL MASTERY HEATMAP (GitHub-style) ──────────── */}
          <GlassCard title="Skill Mastery Heatmap" description="Your knowledge strength across all topics" action={<BarChart3 className="h-4 w-4 text-primary" />}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
              {[
                { topic: "Arrays",        mastery: 90,  status: "mastered"   },
                { topic: "Linked Lists",  mastery: 82,  status: "mastered"   },
                { topic: "Stacks",        mastery: 75,  status: "mastered"   },
                { topic: "Queues",        mastery: 68,  status: "improving"  },
                { topic: "Sorting",       mastery: 60,  status: "improving"  },
                { topic: "Hashing",       mastery: 72,  status: "mastered"   },
                { topic: "Trees",         mastery: 38,  status: "attention"  },
                { topic: "Graphs",        mastery: 35,  status: "attention"  },
                { topic: "Recursion",     mastery: 42,  status: "attention"  },
                { topic: "DP",            mastery: 30,  status: "attention"  },
                { topic: "Searching",     mastery: 65,  status: "improving"  },
                { topic: "Bit Ops",       mastery: 55,  status: "improving"  },
              ].map((t, i) => (
                <motion.div key={t.topic} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className={cn(
                    "relative group flex flex-col items-center justify-center rounded-2xl p-3 border text-center cursor-pointer hover:scale-105 transition-all",
                    t.status === "mastered"  && "bg-success/15 border-success/30 hover:bg-success/25",
                    t.status === "improving" && "bg-warning/10 border-warning/30 hover:bg-warning/20",
                    t.status === "attention" && "bg-destructive/10 border-destructive/20 hover:bg-destructive/20",
                  )}>
                  <div className={cn("font-display font-bold text-lg",
                    t.status === "mastered"  && "text-success",
                    t.status === "improving" && "text-warning",
                    t.status === "attention" && "text-destructive",
                  )}>{t.mastery}%</div>
                  <div className="text-[10px] font-semibold text-muted-foreground mt-0.5 leading-tight">{t.topic}</div>
                  <div className={cn("mt-1 w-full h-1 rounded-full",
                    t.status === "mastered"  && "bg-success",
                    t.status === "improving" && "bg-warning",
                    t.status === "attention" && "bg-destructive",
                  )} style={{ opacity: t.mastery / 100 }} />
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-success inline-block"/>🟢 Mastered (≥70%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-warning inline-block"/>🟡 Improving (40–69%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-destructive inline-block"/>🔴 Needs Attention (&lt;40%)</span>
            </div>
          </GlassCard>

          {/* ── 4. RECENT LEARNING ACTIVITY ──────────────────────── */}
          <GlassCard title="Recent Learning Activity" description="Your learning footprint over the last 7 days" action={<Activity className="h-4 w-4 text-primary" />}>
            <div className="space-y-3">
              {[
                { icon: "🎬", label: "Completed Recursion Video",    sub: "15 min · Mastering Recursion in 15 Minutes",  time: "2 hours ago",   color: "bg-primary/10   border-primary/20"   },
                { icon: "📝", label: "Solved 10 Tree Problems",       sub: "Practice Set · Trees Fundamentals",            time: "Yesterday",     color: "bg-success/10   border-success/20"   },
                { icon: "✅", label: "Passed Mini Assessment",        sub: "Score: 72% · Recursion Basics Check",          time: "2 days ago",    color: "bg-success/10   border-success/20"   },
                { icon: "🏅", label: "Earned Fast Learner Badge",     sub: "Completed 3 activities in one session",        time: "3 days ago",    color: "bg-warning/10   border-warning/20"   },
                { icon: "📖", label: "Read: Call Stack Visualization",sub: "Interactive Notes · 10 min",                   time: "4 days ago",    color: "bg-primary/10   border-primary/20"   },
                { icon: "🔥", label: "5-Day Streak Achieved!",        sub: "Consecutive daily learning sessions",          time: "5 days ago",    color: "bg-destructive/10 border-destructive/20" },
              ].map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className={cn("flex items-center gap-4 rounded-xl border p-3", a.color)}>
                  <div className="text-2xl shrink-0">{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{a.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.sub}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-semibold shrink-0">{a.time}</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* ── 5. UPCOMING MILESTONES ───────────────────────────── */}
          <GlassCard title="Upcoming Learning Milestones" description="Your roadmap checkpoints and estimated dates" action={<Target className="h-4 w-4 text-primary" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Recursion",        status: "current",  date: "June 3",  gain: "In Progress", icon: "🔄" },
                { label: "Tree Traversal",   status: "next",     date: "June 8",  gain: "+18%",        icon: "🌳" },
                { label: "BST Mastery",      status: "upcoming", date: "June 14", gain: "+15%",        icon: "🔍" },
                { label: "Graph Algorithms", status: "future",   date: "June 20", gain: "+20%",        icon: "⚡" },
              ].map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={cn("rounded-2xl border p-4 flex items-center gap-3 transition-all hover:shadow-sm",
                    m.status === "current"  && "border-primary/40 bg-primary/8",
                    m.status === "next"     && "border-success/30 bg-success/8",
                    m.status === "upcoming" && "border-border/60 bg-muted/20",
                    m.status === "future"   && "border-border/40 bg-muted/10 opacity-70",
                  )}>
                  <div className="text-3xl">{m.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-base">{m.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Est. {m.date}</div>
                  </div>
                  <div className={cn("text-xs font-bold px-2 py-1 rounded-full",
                    m.status === "current" ? "bg-primary/15 text-primary" :
                    m.status === "next"    ? "bg-success/15 text-success"  :
                    "bg-muted text-muted-foreground"
                  )}>{m.gain}</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* ── 6. PRACTICE RECOMMENDATIONS ──────────────────────── */}
          <GlassCard title="Practice Recommendations" description="AI-selected exercises based on your weaknesses" action={<Sparkles className="h-4 w-4 text-warning" />}>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { topic: "Recursion",           diff: "Medium",   gain: "+12%", questions: 15, icon: "🔄", urgent: true  },
                { topic: "Tree Problems",        diff: "Medium",   gain: "+9%",  questions: 10, icon: "🌳", urgent: true  },
                { topic: "Graph Traversal",      diff: "Advanced", gain: "+8%",  questions: 12, icon: "🔗", urgent: false },
                { topic: "Dynamic Programming",  diff: "Advanced", gain: "+11%", questions: 8,  icon: "⚡", urgent: false },
              ].map((p, i) => (
                <motion.div key={p.topic} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={cn("rounded-2xl border p-4 flex flex-col hover:border-primary/40 hover:shadow-md transition-all",
                    p.urgent ? "border-destructive/20 bg-gradient-to-br from-destructive/5 to-background" : "border-border/60 bg-card/40"
                  )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{p.icon}</div>
                    {p.urgent && <Badge className="bg-destructive/10 text-destructive border-none text-[9px] uppercase">Urgent</Badge>}
                  </div>
                  <h3 className="font-display font-bold text-base mb-1">{p.topic}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="text-muted-foreground">Difficulty: <strong className="text-foreground">{p.diff}</strong></div>
                    <div className="text-muted-foreground">Questions: <strong className="text-foreground">{p.questions}</strong></div>
                    <div className="col-span-2 text-muted-foreground">Expected Gain: <strong className="text-success">{p.gain}</strong></div>
                  </div>
                  <Button className="mt-auto w-full gradient-primary text-primary-foreground text-xs gap-1.5 shadow-glow">
                    <Play className="h-3.5 w-3.5 fill-current" /> Start Practice
                  </Button>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* ── 7. AI STUDY INSIGHTS ─────────────────────────────── */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-background to-background p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-40" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary shadow-glow">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">AI Study Insights</h3>
                  <div className="text-[10px] text-primary uppercase tracking-wider font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />Personalised for you
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "🚀", text: "You are learning faster than 78% of students in your class.",          color: "border-primary/20  bg-primary/5"  },
                  { icon: "🔗", text: "Completing Recursion will instantly unlock Trees and Graphs modules.",   color: "border-warning/20  bg-warning/5"  },
                  { icon: "📈", text: "Your retention rate improved by 14% compared to last week.",            color: "border-success/20  bg-success/5"  },
                  { icon: "⏰", text: "Best study time detected: 7 PM – 9 PM based on your activity logs.",   color: "border-primary/20  bg-primary/5"  },
                ].map((ins, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                    className={cn("flex items-start gap-3 rounded-xl border p-3.5", ins.color)}>
                    <span className="text-xl shrink-0">{ins.icon}</span>
                    <p className="text-sm leading-relaxed text-foreground/90">{ins.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 8. WEEKLY CHALLENGES ─────────────────────────────── */}
          <GlassCard title="Weekly Challenges" description="Complete these to earn bonus XP and badges" action={<Trophy className="h-4 w-4 text-warning" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Complete 20 Questions",      progress: 14, total: 20, icon: "📝", reward: "+50 XP"  },
                { label: "Finish Recursion Module",    progress: 1,  total: 5,  icon: "🔄", reward: "🏅 Badge" },
                { label: "Maintain 7-Day Streak",      progress: 5,  total: 7,  icon: "🔥", reward: "🔥 Badge" },
                { label: "Pass Practice Test",         progress: 0,  total: 1,  icon: "✅", reward: "+30 XP"  },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border/60 bg-card/30 p-4 hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="font-semibold text-sm">{c.label}</div>
                    </div>
                    <Badge className="bg-warning/15 text-warning border-none text-[9px] uppercase shrink-0">{c.reward}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Progress value={(c.progress / c.total) * 100} className="h-1.5 flex-1" />
                    <span className="text-xs font-bold text-muted-foreground shrink-0">{c.progress}/{c.total}</span>
                  </div>
                  {c.progress >= c.total && (
                    <div className="text-[10px] text-success font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3" /> Completed!
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* ── 9. LEARNING CALENDAR ─────────────────────────────── */}
          <GlassCard title="Learning Calendar" description="June 2026 — Study activity at a glance" action={<Calendar className="h-4 w-4 text-primary" />}>
            <div className="mt-2">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-muted-foreground uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1;
                  const isStudy      = [1,2,4,5,8,9,10,11,12,15,16,17,18,19,22].includes(day);
                  const isAssessment = [7, 14, 21].includes(day);
                  const isToday      = day === 2;
                  const isUpcoming   = day === 10 || day === 17;
                  return (
                    <motion.div key={day} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015 }}
                      title={isAssessment ? "Assessment Day" : isStudy ? "Study Day" : ""}
                      className={cn(
                        "h-8 w-full rounded-lg flex items-center justify-center text-[11px] font-semibold cursor-pointer hover:scale-105 transition-all",
                        isToday      && "ring-2 ring-primary ring-offset-1",
                        isAssessment ? "bg-warning/25 text-warning border border-warning/40" :
                        isUpcoming   ? "bg-primary/20 text-primary border border-primary/30" :
                        isStudy      ? "bg-success/20 text-success border border-success/30" :
                        "bg-muted/30 text-muted-foreground border border-border/30"
                      )}>{day}</motion.div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-success inline-block"/>Study Day</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-warning inline-block"/>Assessment</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-primary inline-block"/>Milestone</span>
              </div>
            </div>
          </GlassCard>

          {/* ── 10. PEER COMPARISON ──────────────────────────────── */}
          <GlassCard title="Peer Comparison" description="How you stack up against your class" action={<Users className="h-4 w-4 text-primary" />}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Your Rank",        value: "Top 15%",  icon: "🏆", color: "text-warning"  },
                { label: "Class Average",    value: "67%",      icon: "📊", color: "text-muted-foreground" },
                { label: "Your Average",     value: "81%",      icon: "⭐", color: "text-primary"  },
                { label: "Questions Solved", value: "84",       icon: "✅", color: "text-success"  },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={cn("font-display font-bold text-2xl", stat.color)}>{stat.value}</div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm text-center">
              💪 You are outperforming <strong>85%</strong> of students in improvement rate this month!
            </div>
          </GlassCard>

          {/* ── 11. RESOURCE LIBRARY ─────────────────────────────── */}
          <GlassCard title="Resource Library" description="Curated learning materials for your current module" action={<Layers className="h-4 w-4 text-primary" />}>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {[
                { label: "Video Lectures",          icon: "🎬", count: 12, color: "bg-primary/10 border-primary/30 hover:bg-primary/20"     },
                { label: "Interactive Simulations", icon: "🎮", count: 5,  color: "bg-success/10 border-success/30 hover:bg-success/20"     },
                { label: "Practice Sheets",         icon: "📝", count: 20, color: "bg-warning/10 border-warning/30 hover:bg-warning/20"     },
                { label: "Flashcards",              icon: "🃏", count: 45, color: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20" },
                { label: "Past Assessments",        icon: "📋", count: 8,  color: "bg-destructive/10 border-destructive/20 hover:bg-destructive/20" },
                { label: "Audio Summaries",         icon: "🎧", count: 6,  color: "bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20" },
              ].map((r, i) => (
                <motion.div key={r.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  className={cn("flex flex-col items-center shrink-0 w-28 rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md hover:scale-105", r.color)}>
                  <div className="text-3xl mb-2">{r.icon}</div>
                  <div className="text-xs font-bold text-center leading-tight">{r.label}</div>
                  <Badge variant="outline" className="mt-2 text-[9px]">{r.count} items</Badge>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* ── 12. ACHIEVEMENT SHOWCASE ─────────────────────────── */}
          <GlassCard title="Achievement Showcase" description="Your earned badges and milestones" action={<Medal className="h-4 w-4 text-warning" />}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "🔥", label: "5 Day Streak",       desc: "Consistent learner",    rarity: "Epic",  glow: "shadow-[0_0_20px_rgba(234,179,8,0.4)]"         },
                { icon: "🏅", label: "Fast Learner",        desc: "3 activities / session", rarity: "Rare",  glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]"        },
                { icon: "📚", label: "Consistent Student",  desc: "10-day login streak",    rarity: "Common",glow: "shadow-[0_0_20px_rgba(99,102,241,0.3)]"         },
                { icon: "⚡", label: "Problem Solver",      desc: "50+ problems solved",    rarity: "Rare",  glow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]"         },
              ].map((badge, i) => (
                <motion.div key={badge.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12, type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50 bg-card/30 hover:bg-muted/20 transition-all group cursor-pointer">
                  <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}
                    className={cn("h-16 w-16 rounded-full border-2 border-border bg-background flex items-center justify-center text-3xl", badge.glow)}>
                    {badge.icon}
                  </motion.div>
                  <div className="font-bold text-sm text-center leading-tight">{badge.label}</div>
                  <div className="text-[10px] text-muted-foreground text-center">{badge.desc}</div>
                  <Badge className={cn("text-[9px] uppercase tracking-wider border-none",
                    badge.rarity === "Epic"   ? "bg-yellow-500/15 text-yellow-600" :
                    badge.rarity === "Rare"   ? "bg-purple-500/15 text-purple-600" :
                    "bg-primary/10 text-primary"
                  )}>{badge.rarity}</Badge>
                </motion.div>
              ))}
            </div>
          </GlassCard>

        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: AI & ANALYTICS SIDEBAR                           */}
        {/* ============================================================== */}
        <div className="space-y-6">
          
          {/* AI Learning Coach Sticky Wrapper */}
          <div className="sticky top-6 space-y-6">
            
            {/* AI Learning Coach Widget */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="rounded-3xl border-2 border-primary/30 bg-gradient-to-b from-primary/10 to-background p-5 shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Bot className="h-24 w-24" /></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary shadow-glow relative">
                  <Bot className="h-5 w-5 text-primary-foreground relative z-10" />
                  <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">AI Learning Coach</h3>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Active Analysis
                  </div>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="rounded-xl bg-background/60 backdrop-blur border border-border/50 p-3 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Current Focus</div>
                    <div className="font-bold text-destructive text-sm mt-0.5">{myStudent.rootCause || "Recursion"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Confidence</div>
                    <div className="font-bold text-foreground text-sm mt-0.5">92%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-background/60 backdrop-blur border border-border/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1"><Clock className="h-3 w-3"/> Est. Time</div>
                    <div className="font-bold text-sm mt-1">5 Hours</div>
                  </div>
                  <div className="rounded-xl bg-background/60 backdrop-blur border border-border/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1"><Target className="h-3 w-3"/> Target</div>
                    <div className="font-bold text-success text-sm mt-1">87% Mastery</div>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground/90 italic border-l-4 border-l-primary leading-relaxed">
                  "You are improving 18% faster than last week! Completing Recursion today will unlock 2 blocked topics."
                </div>
              </div>
            </motion.div>

            {/* Weekly Goals Card */}
            <GlassCard title="Weekly Goals" action={<Target className="h-4 w-4 text-primary" />} className="p-5">
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Progress</span>
                  <span className="text-primary">{Math.round((goalsCompleted / weeklyGoals.length) * 100)}%</span>
                </div>
                <Progress value={(goalsCompleted / weeklyGoals.length) * 100} className="h-2" />
              </div>
              <div className="space-y-2.5">
                {weeklyGoals.map(goal => (
                  <div key={goal.id} className="flex items-start gap-3 group">
                    <div className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors", 
                      goal.done ? "bg-primary border-primary text-primary-foreground shadow-glow" : "border-border bg-background"
                    )}>
                      {goal.done && <CheckSquare className="h-3.5 w-3.5" />}
                    </div>
                    <span className={cn("text-sm transition-colors", goal.done ? "text-muted-foreground line-through opacity-70" : "text-foreground font-medium")}>{goal.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Topic Mastery Heatmap */}
            <GlassCard title="Topic Mastery" action={<BarChart3 className="h-4 w-4 text-primary" />} className="p-5">
              <div className="space-y-3.5">
                {heatTopics.map((topic, idx) => (
                  <div key={topic.topic} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground">{topic.topic}</span>
                      <span className={cn(
                        topic.status === "strong" ? "text-success" : 
                        topic.status === "average" ? "text-warning" : "text-destructive"
                      )}>{topic.mastery}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${topic.mastery}%` }} transition={{ duration: 1, delay: idx * 0.1 }}
                        className={cn("h-full rounded-full", 
                          topic.status === "strong" ? "bg-success" : 
                          topic.status === "average" ? "bg-warning" : "bg-destructive"
                        )} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Learning Velocity</div>
                  <div className="font-bold text-sm text-success mt-0.5">+12% / week</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Concept Retention</div>
                  <div className="font-bold text-sm text-primary mt-0.5">88%</div>
                </div>
              </div>
            </GlassCard>

            {/* Smart Recommendations */}
            <GlassCard title="Recommended Next" action={<Lightbulb className="h-4 w-4 text-warning" />} className="p-5">
              <div className="space-y-3">
                {[
                  { title: "Mastering Recursion in 15 Minutes", type: "Video", diff: "Beginner", impact: "+12%" },
                  { title: "Call Stack Visualization", type: "Interactive", diff: "Intermediate", impact: "+8%" }
                ].map((rec, i) => (
                  <div key={i} className="group rounded-xl border border-border/60 bg-muted/20 p-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-background">{rec.type}</Badge>
                      <Badge className="bg-success/10 text-success border-none text-[9px] uppercase tracking-wider">Est. {rec.impact}</Badge>
                    </div>
                    <h4 className="font-semibold text-sm leading-snug mt-2">{rec.title}</h4>
                    <div className="text-xs text-muted-foreground mt-1 mb-3">Difficulty: {rec.diff}</div>
                    <Button size="sm" className="w-full text-xs h-8 gap-1.5 group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                      Start Learning <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Learning Statistics & Gamification */}
            <GlassCard title="Learning Stats" action={<Trophy className="h-4 w-4 text-primary" />} className="p-5">
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <div className="text-2xl font-display font-bold text-primary">12.5</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Study Hours (Wk)</div>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <div className="text-2xl font-display font-bold text-success">84</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Questions Solved</div>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <div className="text-xl font-display font-bold text-warning">Top 15%</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Current Rank</div>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <div className="text-xl font-display font-bold text-foreground">92/100</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Consistency Score</div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4">
                <div className="text-xs font-semibold mb-3">Recent Badges</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="h-12 w-12 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(234,179,8,0.2)] group-hover:scale-110 transition-transform cursor-help" title="Fast Learner">🏅</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(239,68,68,0.2)] group-hover:scale-110 transition-transform cursor-help" title="5 Day Streak">🔥</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)] group-hover:scale-110 transition-transform cursor-help" title="Consistent Student">📚</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="h-12 w-12 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(34,197,94,0.2)] group-hover:scale-110 transition-transform cursor-help" title="Quick Problem Solver">⚡</div>
                  </div>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </div>
    </div>
  );
}
