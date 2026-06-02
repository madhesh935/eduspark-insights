import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  TrendingUp, BookOpen, Award, AlertTriangle, Sparkles, Heart,
  CalendarDays, MessageSquare, CheckCircle2, Clock, ArrowRight, Phone,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { StatCard } from "@/components/stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { students, assessments, classes, teachers, achievements } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/parent-dashboard")({
  head: () => ({ meta: [{ title: "Parent Dashboard — InsightEDU" }] }),
  component: ParentDashboard,
});

const myChild = students.find((s) => s.risk === "high") ?? students[0];
const myClass  = classes.find(c => c.id === myChild.classId);
const myTeacher = teachers.find(t => t.id === myChild.teacherId);

const improvementData = [
  { month: "Jan", score: 43 },
  { month: "Feb", score: 48 },
  { month: "Mar", score: 52 },
  { month: "Apr", score: 55 },
  { month: "May", score: 62 },
  { month: "Jun", score: 68 },
];

const weeklyActivity = [
  { day: "Mon", hours: 1.5, tasks: 4 },
  { day: "Tue", hours: 0.5, tasks: 1 },
  { day: "Wed", hours: 2.0, tasks: 6 },
  { day: "Thu", hours: 1.0, tasks: 3 },
  { day: "Fri", hours: 1.8, tasks: 5 },
  { day: "Sat", hours: 0.8, tasks: 2 },
  { day: "Sun", hours: 0.2, tasks: 1 },
];

const upcomingAssessments = assessments.filter(a => a.classId === myChild.classId && a.status !== "completed").slice(0, 3);

const teacherMessages = [
  { id: 1, from: myTeacher?.name ?? "Sara Rao", text: `${myChild.name.split(" ")[0]} showed great effort in today's recursion class. Keep encouraging daily practice!`, time: "Today 4:30 PM", read: true },
  { id: 2, from: "System", text: "A new learning plan has been generated for your child. View it in the learning path section.", time: "Yesterday", read: false },
  { id: 3, from: myTeacher?.name ?? "Sara Rao", text: "Assessment results for Trees & Graphs are now available. Please review the AI feedback.", time: "2 days ago", read: true },
];

const radarData = Object.entries(myChild.topicMastery).slice(0, 6).map(([subject, mastery]) => ({
  subject: subject.replace(" Programming", "").replace(" Lists", ""),
  mastery,
}));

function ParentDashboard() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Parent Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitoring <strong className="text-foreground">{myChild.name}</strong>'s learning journey in real-time.
          </p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
          <Phone className="h-4 w-4" /> Contact Teacher
        </Button>
      </div>

      {/* Child profile card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard glow>
          <div className="flex flex-wrap items-center gap-5">
            <Avatar className="h-16 w-16 ring-2 ring-primary/30 shadow-card">
              <AvatarImage src={myChild.avatar} />
              <AvatarFallback className="text-lg font-bold">
                {myChild.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-display text-xl font-bold">{myChild.name}</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                Grade {myChild.grade} · {myClass?.name ?? "Data Structures"} · {myClass?.subject}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Teacher: <span className="font-medium text-foreground">{myTeacher?.name}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge className={cn(
                  myChild.risk === "high"   ? "bg-destructive/15 text-destructive border-destructive/20" :
                  myChild.risk === "medium" ? "bg-warning/15 text-warning border-warning/20"             :
                                              "bg-success/15 text-success border-success/20"
                )}>
                  {myChild.risk === "high" ? "⚠️ Needs Support" : myChild.risk === "medium" ? "📈 Progressing" : "✅ On Track"}
                </Badge>
                <Badge variant="secondary">Attendance: {myChild.attendance}%</Badge>
                {myChild.weakTopics.length > 0 && (
                  <Badge className="bg-destructive/10 text-destructive">
                    {myChild.gaps} learning gaps
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-4xl font-bold text-gradient">{myChild.performance}%</div>
              <div className="text-xs text-muted-foreground mt-1">Overall score</div>
              <div className="text-xs text-success font-semibold mt-0.5">↑ +15% this month</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Attendance"      value={`${myChild.attendance}%`} icon={Heart}         tone="success"     index={0} subtitle="This semester" />
        <StatCard label="Assessments"     value="6"                         icon={BookOpen}      tone="primary"     index={1} subtitle="2 upcoming" />
        <StatCard label="Gaps Detected"   value={String(myChild.gaps)}      icon={AlertTriangle} tone="destructive" index={2} subtitle="AI monitored" />
        <StatCard label="Score Gain"      value="+15%"                      icon={TrendingUp}    tone="success"     index={3} subtitle="vs last month" />
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Score trend */}
        <GlassCard title="Score Improvement" description="Monthly performance over 6 months">
          <div className="h-52">
            <ResponsiveContainer>
              <AreaChart data={improvementData} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[35, 80]} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="score" name="Score %" stroke="var(--primary)" fill="url(#sg)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Skill radar */}
        <GlassCard title="Skill Map" description="Topic competency overview">
          <div className="h-52">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Radar name="Mastery" dataKey="mastery" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Weekly activity */}
      <GlassCard title="Weekly Study Activity" description="Hours spent and tasks completed each day this week">
        <div className="h-40">
          <ResponsiveContainer>
            <LineChart data={weeklyActivity} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="hours" name="Study hrs" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--primary)" }} />
              <Line type="monotone" dataKey="tasks" name="Tasks done" stroke="var(--success)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Learning profile */}
        <GlassCard title="Learning Profile" description="Strengths & areas needing support">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-success">Strengths</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(myChild.topicMastery)
                  .filter(([, v]) => v >= 72)
                  .slice(0, 4)
                  .map(([t]) => (
                    <span key={t} className="rounded-full bg-success/10 text-success text-xs px-2.5 py-1 font-medium">{t}</span>
                  ))}
                {Object.entries(myChild.topicMastery).filter(([, v]) => v >= 72).length === 0 && (
                  <span className="text-xs text-muted-foreground">Developing across all areas</span>
                )}
              </div>
            </div>
            <div className="border-t border-border/50 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">Needs Improvement</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {myChild.weakTopics.map(t => (
                  <span key={t} className="rounded-full bg-destructive/10 text-destructive text-xs px-2.5 py-1 font-medium">{t}</span>
                ))}
              </div>
            </div>
            {myChild.rootCause && (
              <div className="border-t border-border/50 pt-4 rounded-xl bg-warning/5 border border-warning/20 p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI Root Cause</div>
                <div className="font-semibold text-sm">{myChild.rootCause}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Fixing this will resolve all weak topics</div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Upcoming assessments */}
        <GlassCard title="Upcoming Assessments" description="Next scheduled tests for your child" action={<CalendarDays className="h-4 w-4 text-primary" />}>
          <div className="space-y-2">
            {upcomingAssessments.length > 0 ? upcomingAssessments.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity:0, x:6 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.06 }}
                className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold">
                  {new Date(a.scheduledAt).getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {a.duration} mins · {a.questionCount} questions
                  </div>
                </div>
                <Badge className={cn("text-[10px] shrink-0",
                  a.status === "live" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                )}>{a.status}</Badge>
              </motion.div>
            )) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <CheckCircle2 className="mx-auto h-8 w-8 text-success mb-2" />
                No upcoming assessments
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Achievements */}
      <GlassCard title="Achievements Earned" description={`${myChild.name.split(" ")[0]}'s badges and milestones`} action={<Award className="h-4 w-4 text-warning" />}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {achievements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.07 }}
              className="flex flex-col items-center rounded-2xl border border-border/60 bg-muted/30 p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition">
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Teacher messages */}
      <GlassCard title="Messages from Teacher" description="Recent communication from the school" action={<MessageSquare className="h-4 w-4 text-primary" />}>
        <div className="space-y-3">
          {teacherMessages.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
              className={cn("rounded-2xl border p-4 transition",
                !m.read ? "border-primary/20 bg-primary/5" : "border-border/50"
              )}>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {m.from[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{m.from}</span>
                    <span className="text-xs text-muted-foreground">{m.time}</span>
                    {!m.read && <Badge className="bg-primary/10 text-primary text-[9px]">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{m.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 gap-2">
          View all messages <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </GlassCard>

      {/* AI Summary */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard glow>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">AI Parent Summary</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Your child, <strong className="text-foreground">{myChild.name}</strong>, is showing promising improvement with a{" "}
                <strong className="text-foreground">+15% score increase</strong> this month. They currently need additional support in{" "}
                <strong className="text-foreground">{myChild.weakTopics.join(" and ") || "Trees and Graphs"}</strong>, traced to a
                foundational gap in <strong className="text-foreground">{myChild.rootCause || "Recursion"}</strong>. The teacher has been
                notified and a personalised learning plan has been generated. With 30 minutes of daily practice, mastery is projected to
                improve within <strong className="text-foreground">1–2 weeks</strong>.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="rounded-xl bg-success/10 border border-success/20 px-3 py-2 text-xs text-success font-medium">
                  ✅ Intervention plan approved by teacher
                </div>
                <div className="rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs text-primary font-medium">
                  📚 Learning path assigned
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
