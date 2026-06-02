import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Sparkles, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { RiskBadge } from "@/components/risk-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { students } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/students")({
  head: () => ({ meta: [{ title: "Students — InsightEDU" }] }),
  component: StudentsPage,
});

const PAGE_SIZE = 8;

function StudentsPage() {
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState("all");
  const [grade, setGrade] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return students.filter((s) =>
      (q === "" || s.name.toLowerCase().includes(q.toLowerCase())) &&
      (risk === "all" || s.risk === risk) &&
      (grade === "all" || s.grade === grade)
    );
  }, [q, risk, grade]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Students</h1>
        <p className="text-sm text-muted-foreground">Manage your roster, identify risk, assign remediation.</p>
      </div>

      <GlassCard>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search students…" className="pl-9" />
          </div>
          <Select value={risk} onValueChange={(v) => { setRisk(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={grade} onValueChange={(v) => { setGrade(v); setPage(1); }}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              {["8","9","10","11","12"].map((g) => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Student</th>
                <th className="py-3 pr-4 font-medium">Grade</th>
                <th className="py-3 pr-4 font-medium">Attendance</th>
                <th className="py-3 pr-4 font-medium">Performance</th>
                <th className="py-3 pr-4 font-medium">Risk</th>
                <th className="py-3 pr-4 font-medium">Gaps</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {view.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 hover:bg-accent/40 transition"
                >
                  <td className="py-3 pr-4">
                    <Link to="/students/$id" params={{ id: s.id }} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={s.avatar} />
                        <AvatarFallback>{s.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium hover:text-primary">{s.name}</div>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{s.grade}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${s.attendance}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-semibold">{s.performance}</td>
                  <td className="py-3 pr-4"><RiskBadge level={s.risk} /></td>
                  <td className="py-3 pr-4">{s.gaps}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button asChild size="sm" variant="ghost"><Link to="/students/$id" params={{ id: s.id }}><Eye className="h-3.5 w-3.5" /></Link></Button>
                      <Button size="sm" variant="ghost"><Sparkles className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost"><BookOpen className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {view.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">No students match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Showing {view.length} of {filtered.length}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
            <span className="text-xs">Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
