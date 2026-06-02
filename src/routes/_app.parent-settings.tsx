import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { students } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_app/parent-settings")({
  head: () => ({ meta: [{ title: "Settings — Parent Portal" }] }),
  component: ParentSettings,
});

const myChild = students.find((s) => s.risk === "high") ?? students[0];

function ParentSettings() {
  const { theme, setTheme } = useTheme();
  const [notif, setNotif] = useState({
    gapDetected: true,
    intervention: true,
    weeklyReport: true,
    assessmentDue: false,
    riskAlert: true,
  });
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Parent Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and notification preferences.</p>
      </div>

      {/* Parent Profile */}
      <GlassCard title="Parent Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Full name</Label><Input className="mt-1.5" defaultValue="Parent of Aanya" /></div>
          <div><Label>Email</Label><Input className="mt-1.5" defaultValue="parent@family.com" /></div>
          <div><Label>Phone</Label><Input className="mt-1.5" defaultValue="+91 98765 43210" /></div>
          <div><Label>Relationship</Label><Input className="mt-1.5" defaultValue="Parent / Guardian" /></div>
        </div>
        <Button className="mt-4 gradient-primary text-primary-foreground" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? "✓ Saved!" : "Save changes"}
        </Button>
      </GlassCard>

      {/* Linked Child */}
      <GlassCard title="Linked Child" description="Your child's InsightEDU account">
        <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{myChild.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{myChild.name}</div>
            <div className="text-sm text-muted-foreground">Grade {myChild.grade} · Student ID: {myChild.id.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Attendance: {myChild.attendance}% · Score: {myChild.performance}%</div>
          </div>
          <div className="ml-auto text-[10px] rounded-full bg-success/10 text-success px-2 py-0.5 font-semibold">✅ Linked</div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard title="Notifications" description="What should InsightEDU alert you about?">
        {[
          { k: "gapDetected" as const, label: "Learning gap detected", desc: "Immediately when AI identifies a new gap" },
          { k: "riskAlert" as const, label: "Risk alert", desc: "When your child is flagged as at-risk" },
          { k: "intervention" as const, label: "Intervention approved", desc: "When teacher approves an AI intervention" },
          { k: "weeklyReport" as const, label: "Weekly progress report", desc: "Every Sunday with a full summary" },
          { k: "assessmentDue" as const, label: "Upcoming assessment reminder", desc: "24 hours before a new quiz" },
        ].map((n) => (
          <div key={n.k} className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
            <div>
              <div className="text-sm font-medium">{n.label}</div>
              <div className="text-xs text-muted-foreground">{n.desc}</div>
            </div>
            <Switch checked={notif[n.k]} onCheckedChange={(v) => setNotif({ ...notif, [n.k]: v })} />
          </div>
        ))}
      </GlassCard>

      {/* Appearance */}
      <GlassCard title="Appearance">
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {(["light", "dark"] as const).map((t) => (
            <button key={t} onClick={() => setTheme(t)}
              className={cn("rounded-xl border p-4 text-sm font-medium capitalize transition",
                theme === t ? "border-primary bg-primary/10 text-primary shadow-glow" : "border-border hover:bg-accent"
              )}>
              {t === "light" ? "☀️" : "🌙"} {t} mode
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
