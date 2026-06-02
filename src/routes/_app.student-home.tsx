import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen, Clock, Flame, Award, ChevronRight, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Target,
  FileText, BarChart3, Activity, Play
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { students, assessments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/student-home")({
  head: () => ({ meta: [{ title: "My Dashboard — InsightEDU" }] }),
  component: StudentHome,
});

const myStudent = students.find((s) => s.risk === "high") ?? students[0];
const upcomingAssessments = assessments.filter((a) => a.status === "active").slice(0, 2);

const recentScores = [
  { id: 1, title: "Trees Quiz", score: 68, trend: "up", date: "2 days ago" },
  { id: 2, title: "Linked Lists Deep Dive", score: 85, trend: "up", date: "1 week ago" },
];

function StudentHome() {
  const streak = 5;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/40">
            <AvatarImage src={myStudent.avatar} />
            <AvatarFallback>{myStudent.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back, {myStudent.name.split(" ")[0]}! 👋</h1>
            <p className="text-sm text-muted-foreground">Grade {myStudent.grade} · {upcomingAssessments.length} pending assessment{upcomingAssessments.length!==1?"s":""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-2">
          <Flame className="h-5 w-5 text-warning" />
          <div>
            <div className="font-bold text-warning">{streak}-day streak</div>
            <div className="text-[10px] text-muted-foreground">Keep it up!</div>
          </div>
        </div>
      </motion.div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Overall Score"  value={`${myStudent.performance}%`} icon={TrendingUp}    tone="primary"     index={0} subtitle="This semester" />
        <StatCard label="Study Streak"   value={`${streak} days`}             icon={Flame}         tone="warning"     index={1} subtitle="Daily goal: 30 min" />
        <StatCard label="Attendance"     value={`${myStudent.attendance}%`}   icon={BookOpen}      tone="success"     index={2} subtitle="This month" />
        <StatCard label="Learning Gaps"  value={String(myStudent.gaps)}        icon={AlertTriangle} tone="destructive" index={3} subtitle="AI monitored" />
      </div>

      {/* Main Grid */}
      <div className="grid gap-5 lg:grid-cols-[1fr_350px]">
        
        {/* Left Column - Core Info */}
        <div className="space-y-5">
          {/* Upcoming Assessments */}
          <GlassCard title="Upcoming Assessments" description="Due soon" action={<Link to="/student-assessment" className="text-xs text-primary hover:underline">View All Center →</Link>}>
            <div className="space-y-3">
              {upcomingAssessments.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-border/60 p-3 hover:bg-accent/40 hover:border-primary/40 transition">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <Clock className="h-3 w-3" /> {a.duration} min
                      <span>·</span>
                      <BookOpen className="h-3 w-3" /> {a.questionCount} questions
                    </div>
                  </div>
                  <Badge className="bg-success/15 text-success ring-1 ring-success/30 shrink-0 hidden sm:flex">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />Live
                  </Badge>
                  <Link to="/student-assessment">
                    <Button size="sm" className="gradient-primary text-primary-foreground gap-1 shrink-0">
                      Start <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
              {upcomingAssessments.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  <CheckCircle2 className="mx-auto h-8 w-8 mb-2 text-success opacity-60" />
                  You're all caught up!
                </div>
              )}
            </div>
          </GlassCard>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Recent Scores */}
            <GlassCard title="Recent Scores" action={<BarChart3 className="h-4 w-4 text-primary" />}>
              <div className="space-y-3">
                {recentScores.map((score, i) => (
                  <div key={score.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card/30">
                    <div>
                      <div className="font-semibold text-sm">{score.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{score.date}</div>
                    </div>
                    <div className={cn("text-lg font-bold", score.score >= 80 ? "text-success" : "text-primary")}>
                      {score.score}%
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Latest Improvements */}
            <GlassCard title="Latest Improvements" action={<TrendingUp className="h-4 w-4 text-success" />}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Trees</span>
                    <span className="text-success">+31% Growth</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-success w-[79%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Graphs</span>
                    <span className="text-primary">+35% Growth</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[65%]" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column - Recommendations & Progress */}
        <div className="space-y-5">
          {/* Assessment Progress */}
          <GlassCard title="Term Progress" action={<Target className="h-4 w-4 text-primary" />}>
            <div className="mb-2">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Assessments Completed</span>
                <span className="text-primary">12 / 15</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <p className="text-[10px] text-muted-foreground">You are on track to complete all assigned term assessments.</p>
          </GlassCard>

          {/* AI Recommended Next Assessment */}
          <GlassCard title="Recommended Next" className="bg-gradient-to-br from-primary/5 to-background border-primary/20" action={<Sparkles className="h-4 w-4 text-warning" />}>
            <div className="text-center py-2">
              <div className="h-10 w-10 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-base mb-1">Recursion Mastery Test</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Taking this targeted quiz will identify exact gaps in your recursive logic.
              </p>
              <div className="bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                Expected Gain: +15%
              </div>
              <Link to="/student-assessment">
                <Button className="w-full gradient-primary text-primary-foreground shadow-glow gap-2 text-xs">
                  Attempt Assessment <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </GlassCard>


        </div>

      </div>
    </div>
  );
}
