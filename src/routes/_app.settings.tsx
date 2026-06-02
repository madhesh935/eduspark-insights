import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — InsightEDU" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notif, setNotif] = useState({ risk: true, gaps: true, weekly: false });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, institution and preferences.</p>
      </div>

      <GlassCard title="Profile">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" />
            <AvatarFallback>SR</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">Change photo</Button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><Label>Full name</Label><Input className="mt-1.5" defaultValue="Sara Rao" /></div>
          <div><Label>Email</Label><Input className="mt-1.5" defaultValue="sara@insightedu.io" /></div>
          <div><Label>Role</Label><Input className="mt-1.5" defaultValue="Teacher" disabled /></div>
          <div><Label>Subject</Label><Input className="mt-1.5" defaultValue="Computer Science" /></div>
        </div>
      </GlassCard>

      <GlassCard title="Institution">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Institution name</Label><Input className="mt-1.5" defaultValue="Lincoln High School" /></div>
          <div><Label>Location</Label><Input className="mt-1.5" defaultValue="Bengaluru, IN" /></div>
        </div>
      </GlassCard>

      <GlassCard title="Theme">
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn("rounded-xl border p-4 text-sm font-medium capitalize transition",
                theme === t ? "border-primary bg-primary/10 text-primary shadow-glow" : "border-border hover:bg-accent")}
            >
              {t} mode
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Notifications">
        {[
          { k: "risk" as const, label: "Student at-risk alerts", desc: "When AI flags declining performance" },
          { k: "gaps" as const, label: "New learning gap detected", desc: "Topic-level gap discoveries" },
          { k: "weekly" as const, label: "Weekly digest", desc: "Class summary delivered every Monday" },
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

      <GlassCard title="Account Security">
        <Button variant="outline">Change password</Button>
        <Button variant="outline" className="ml-2">Enable 2FA</Button>
        <Button variant="destructive" className="ml-2">Delete account</Button>
      </GlassCard>
    </div>
  );
}
