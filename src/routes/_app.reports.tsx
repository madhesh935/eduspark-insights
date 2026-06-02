import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, FileSpreadsheet, FileText, Download, Users, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — InsightEDU" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export student & classroom reports.</p>
      </div>

      <Tabs defaultValue="student">
        <TabsList>
          <TabsTrigger value="student"><Users className="mr-1.5 h-3.5 w-3.5" /> Student reports</TabsTrigger>
          <TabsTrigger value="class"><BookOpen className="mr-1.5 h-3.5 w-3.5" /> Class reports</TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="mt-5">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: "Performance Summary", desc: "Scores, mastery and trends per student", icon: FileBarChart },
              { title: "Learning Gaps Report", desc: "Topic-by-topic gap analysis", icon: FileText },
              { title: "Personalized Recommendations", desc: "AI-generated next-step plans", icon: FileSpreadsheet },
            ].map((r) => (
              <GlassCard key={r.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold">{r.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1"><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
                  <Button size="sm" variant="outline" className="flex-1"><Download className="mr-1.5 h-3.5 w-3.5" />Excel</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="class" className="mt-5">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: "Topic Analysis", desc: "Class-wide mastery per topic" },
              { title: "Risk Distribution", desc: "Students by predicted risk band" },
              { title: "Class Trends", desc: "Weekly & monthly performance" },
            ].map((r) => (
              <GlassCard key={r.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileBarChart className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold">{r.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1"><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
                  <Button size="sm" variant="outline" className="flex-1"><Download className="mr-1.5 h-3.5 w-3.5" />Excel</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
