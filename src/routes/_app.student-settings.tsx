import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, TrendingUp, AlertTriangle, Award, Flame, Shield, Bell,
  Moon, Sun, User, Lock, Download, Trash2, CheckCircle2, Eye, EyeOff,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { students, achievements } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/student-settings")({
  head: () => ({ meta: [{ title: "Settings — Student Portal" }] }),
  component: StudentSettings,
});

const myStudent = students.find(s => s.risk === "high") ?? students[0];

function StudentSettings() {
  const { theme, setTheme } = useTheme();
  const [notif, setNotif] = useState({
    assessments: true, gaps: true, pathUpdates: true, parentAlerts: false, weeklyReport: false, achievementAlerts: true,
  });
  const [studyTime, setStudyTime] = useState("Morning");
  const [studyGoal, setStudyGoal] = useState("30 min");
  const [language, setLanguage] = useState("English");
  const [fontSize, setFontSize] = useState("Medium");
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const savePw = () => { setPwSaved(true); setTimeout(() => setPwSaved(false), 2500); };

  const streak = 5;
  const totalXP = 1240;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Student Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, preferences, notifications and security.</p>
      </div>

      {/* ── Profile ── */}
      <GlassCard title="My Profile" description="Your academic identity on InsightEDU">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-primary/40 shadow-card">
              <AvatarImage src={myStudent.avatar} />
              <AvatarFallback className="text-lg font-bold">{myStudent.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full gradient-primary shadow-glow flex items-center justify-center text-primary-foreground">
              <User className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-lg">{myStudent.name}</div>
            <div className="text-sm text-muted-foreground">Grade {myStudent.grade} · Student ID: {myStudent.id.toUpperCase()}</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge className={cn("text-[10px]",
                myStudent.risk==="high"?"bg-destructive/10 text-destructive":myStudent.risk==="medium"?"bg-warning/10 text-warning":"bg-success/10 text-success"
              )}>
                {myStudent.risk==="high"?"⚠️ Needs Support":myStudent.risk==="medium"?"📈 Progressing":"✅ On Track"}
              </Badge>
              <Badge className="bg-primary/10 text-primary text-[10px]">
                <Flame className="mr-1 h-2.5 w-2.5" />{streak}-day streak
              </Badge>
              <Badge className="bg-warning/10 text-warning text-[10px]">
                ⭐ {totalXP} XP
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><Label>Full Name</Label><Input className="mt-1.5" defaultValue={myStudent.name} /></div>
          <div><Label>Email</Label><Input className="mt-1.5" defaultValue={`${myStudent.name.split(" ")[0].toLowerCase()}@student.insightedu.io`} /></div>
          <div><Label>Grade</Label><Input className="mt-1.5" defaultValue={`Grade ${myStudent.grade}`} disabled /></div>
          <div><Label>Student ID</Label><Input className="mt-1.5" defaultValue={myStudent.id.toUpperCase()} disabled /></div>
          <div><Label>Phone (optional)</Label><Input className="mt-1.5" placeholder="+91 98765 43210" /></div>
          <div>
            <Label>Language</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {["English","Tamil","Hindi"].map(l => (
                <button key={l} onClick={() => setLanguage(l)}
                  className={cn("rounded-xl border px-2 py-1.5 text-xs font-medium transition",
                    language===l?"border-primary bg-primary/10 text-primary":"border-border hover:bg-accent"
                  )}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <Button className="mt-4 gradient-primary text-primary-foreground gap-2" onClick={save}>
          {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : "Save Profile"}
        </Button>
      </GlassCard>

      {/* ── Learning Profile (read-only) ── */}
      <GlassCard title="My Learning Profile" description="AI-generated snapshot of your current academic status">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label:"Performance",  value:`${myStudent.performance}%`, icon:TrendingUp,    color:"text-primary"     },
            { label:"Attendance",   value:`${myStudent.attendance}%`,  icon:BookOpen,      color:"text-success"     },
            { label:"Learning Gaps",value:String(myStudent.gaps),      icon:AlertTriangle, color:"text-destructive" },
            { label:"Path Steps",   value:String(myStudent.learningPath.length), icon:Award, color:"text-warning"  },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
              className="rounded-2xl bg-muted/50 p-3 text-center">
              <s.icon className={cn("mx-auto h-5 w-5 mb-1.5", s.color)} />
              <div className={cn("font-bold text-xl", s.color)}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Topic mastery bars */}
        <div className="mt-4 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Topic Mastery</div>
          {Object.entries(myStudent.topicMastery).slice(0,6).map(([topic, mastery], i) => (
            <motion.div key={topic} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
              className="flex items-center gap-3">
              <div className="w-28 shrink-0 text-xs text-muted-foreground truncate">{topic}</div>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width:0 }} animate={{ width:`${mastery}%` }} transition={{ duration:0.7, delay:i*0.06 }}
                  className={cn("h-full rounded-full", mastery>=75?"bg-success":mastery>=50?"gradient-primary":"bg-warning")} />
              </div>
              <span className={cn("text-xs font-bold w-8 text-right", mastery>=75?"text-success":mastery>=50?"text-primary":"text-warning")}>{mastery}%</span>
            </motion.div>
          ))}
        </div>

        {/* Weak topics + root cause */}
        <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1.5">Weak Topics</div>
          <div className="flex flex-wrap gap-1.5">
            {myStudent.weakTopics.map(t=>(
              <span key={t} className="rounded-full bg-destructive/10 text-destructive text-xs px-2.5 py-1">{t}</span>
            ))}
            {myStudent.rootCause && (
              <span className="rounded-full bg-warning/10 text-warning text-xs px-2.5 py-1">⚡ Root: {myStudent.rootCause}</span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* ── Achievements ── */}
      <GlassCard title="My Achievements" description="Badges and milestones earned so far">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {achievements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.07 }}
              className="flex flex-col items-center rounded-2xl border border-border/60 bg-muted/30 p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition">
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="text-xs font-semibold">{a.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* ── Appearance ── */}
      <GlassCard title="Appearance & Accessibility">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Theme</Label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {(["light","dark"] as const).map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  className={cn("rounded-xl border p-4 text-sm font-medium capitalize transition flex items-center gap-2",
                    theme===t?"border-primary bg-primary/10 text-primary shadow-glow":"border-border hover:bg-accent"
                  )}>
                  {t==="light"?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>} {t} mode
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Font Size</Label>
            <div className="flex gap-2">
              {["Small","Medium","Large"].map(f => (
                <button key={f} onClick={() => setFontSize(f)}
                  className={cn("rounded-xl border px-4 py-2 text-sm font-medium transition",
                    fontSize===f?"border-primary bg-primary/10 text-primary":"border-border hover:bg-accent"
                  )}>{f}</button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── Learning Preferences ── */}
      <GlassCard title="Learning Preferences" description="Help the AI personalise your study plan">
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block">Preferred Study Time</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label:"🌅 Morning",  sub:"6 AM – 12 PM"  },
                { label:"☀️ Afternoon",sub:"12 PM – 6 PM"  },
                { label:"🌙 Evening",  sub:"6 PM – 10 PM"  },
              ].map(t => (
                <button key={t.label} onClick={() => setStudyTime(t.label)}
                  className={cn("rounded-xl border p-3 text-left text-xs font-medium transition",
                    studyTime===t.label?"border-primary bg-primary/10 text-primary":"border-border hover:bg-accent"
                  )}>
                  <div>{t.label}</div>
                  <div className="text-muted-foreground mt-0.5">{t.sub}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Daily Study Goal</Label>
            <div className="grid grid-cols-4 gap-2">
              {["15 min","30 min","45 min","1 hour"].map(g => (
                <button key={g} onClick={() => setStudyGoal(g)}
                  className={cn("rounded-xl border px-2 py-2 text-xs font-medium transition",
                    studyGoal===g?"border-primary bg-primary/10 text-primary":"border-border hover:bg-accent"
                  )}>{g}</button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block">AI Explanation Style</Label>
            <div className="grid grid-cols-3 gap-2">
              {["Simple analogies","Code-first","Step-by-step"].map(s => (
                <button key={s} className="rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:border-primary/40 transition first:border-primary first:bg-primary/10 first:text-primary">{s}</button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── Notifications ── */}
      <GlassCard title="Notifications" description="Control what InsightEDU notifies you about" action={<Bell className="h-4 w-4 text-primary" />}>
        <div className="space-y-1">
          {[
            { k:"assessments"     as const, label:"New assessment available",      desc:"When your teacher publishes a quiz"        },
            { k:"gaps"            as const, label:"Learning gap detected",          desc:"After AI analyses your results"            },
            { k:"pathUpdates"     as const, label:"Learning path updates",          desc:"When AI adds new steps to your path"       },
            { k:"achievementAlerts" as const, label:"Achievement unlocked",         desc:"Celebrate your milestones"                 },
            { k:"parentAlerts"    as const, label:"Parent notification copies",     desc:"Receive a copy when parents are notified"  },
            { k:"weeklyReport"    as const, label:"Weekly progress digest",         desc:"Summary every Monday morning"              },
          ].map(n => (
            <div key={n.k} className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
              <div>
                <div className="text-sm font-medium">{n.label}</div>
                <div className="text-xs text-muted-foreground">{n.desc}</div>
              </div>
              <Switch checked={notif[n.k]} onCheckedChange={v => setNotif({...notif, [n.k]:v})} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Security ── */}
      <GlassCard title="Account Security" description="Manage your password and account protection" action={<Shield className="h-4 w-4 text-primary" />}>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Current Password</Label>
              <div className="relative mt-1.5">
                <Input type={showPw?"text":"password"} placeholder="••••••••" className="pr-10" />
                <button onClick={() => setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" placeholder="Min 8 characters" className="mt-1.5" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button className="gradient-primary text-primary-foreground gap-2" onClick={savePw}>
              {pwSaved?<><CheckCircle2 className="h-4 w-4"/>Password Updated!</>:<><Lock className="h-4 w-4"/>Update Password</>}
            </Button>
            <Button variant="outline" className="gap-2">
              <Shield className="h-4 w-4" /> Enable 2FA
            </Button>
          </div>
          <div className="border-t border-border/60 pt-4">
            <div className="text-sm font-semibold mb-3">Data & Privacy</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export My Data
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                <Trash2 className="h-3.5 w-3.5" /> Delete Account
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
