import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, Users, AlertTriangle, BarChart3, ChevronRight,
  GraduationCap, Clock, Sparkles, CheckCircle2, X,
  Search, Filter, Eye, ChevronLeft,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { RiskBadge } from "@/components/risk-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { classes, assessments, students } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/teacher-classes")({
  head: () => ({ meta: [{ title: "My Classes — InsightEDU" }] }),
  component: TeacherClassesPage,
});

const PAGE_SIZE = 8;

function TeacherClassesPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [created, setCreated]       = useState(false);
  const [form, setForm] = useState({ name: "", subject: "Computer Science", grade: "11", semester: "Semester 2 — 2025" });

  // Student roster state
  const [classFilter, setClassFilter] = useState("all");
  const [q, setQ]         = useState("");
  const [risk, setRisk]   = useState("all");
  const [grade, setGrade] = useState("all");
  const [page, setPage]   = useState(1);

  const myClasses = classes.filter((c) => c.teacherId === "t1");

  const filtered = useMemo(() => {
    return students.filter((s) =>
      (classFilter === "all" || s.classId === classFilter) &&
      (q === "" || s.name.toLowerCase().includes(q.toLowerCase())) &&
      (risk  === "all" || s.risk  === risk) &&
      (grade === "all" || s.grade === grade)
    );
  }, [classFilter, q, risk, grade]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">My Classes</h1>
          <p className="text-sm text-muted-foreground">Manage your classes, student roster, and assessments.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gradient-primary text-primary-foreground shadow-glow gap-2">
          <Plus className="h-4 w-4" /> Create Class
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Classes",             value: myClasses.length,                                       icon: BookOpen,    color: "text-primary" },
          { label: "Total Students",      value: myClasses.reduce((a, c) => a + c.studentCount, 0),      icon: Users,       color: "text-success" },
          { label: "Gap Alerts",          value: myClasses.reduce((a, c) => a + c.gapAlerts, 0),         icon: AlertTriangle, color: "text-destructive" },
          { label: "Active Assessments",  value: myClasses.reduce((a, c) => a + c.activeAssessments, 0), icon: BarChart3,   color: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard>
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10", s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="classes">
        <TabsList className="rounded-xl">
          <TabsTrigger value="classes"><BookOpen className="mr-1.5 h-3.5 w-3.5" />Classes</TabsTrigger>
          <TabsTrigger value="students"><Users className="mr-1.5 h-3.5 w-3.5" />Student Roster</TabsTrigger>
        </TabsList>

        {/* ─── CLASSES TAB ─── */}
        <TabsContent value="classes" className="mt-5">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {myClasses.map((cls, i) => {
              const classAssessments = assessments.filter((a) => a.classId === cls.id);
              return (
                <motion.div key={cls.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <GlassCard className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <Badge variant={cls.gapAlerts > 5 ? "destructive" : "secondary"}>
                        {cls.gapAlerts} gap alerts
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground">{cls.subject} · Grade {cls.grade} · {cls.semester}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-muted/60 p-2">
                        <div className="font-bold text-sm">{cls.studentCount}</div>
                        <div className="text-[10px] text-muted-foreground">Students</div>
                      </div>
                      <div className="rounded-xl bg-muted/60 p-2">
                        <div className="font-bold text-sm">{cls.avgPerformance}%</div>
                        <div className="text-[10px] text-muted-foreground">Avg Score</div>
                      </div>
                      <div className="rounded-xl bg-muted/60 p-2">
                        <div className="font-bold text-sm">{classAssessments.length}</div>
                        <div className="text-[10px] text-muted-foreground">Assessments</div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                        <span>Class performance</span>
                        <span className="font-semibold text-foreground">{cls.avgPerformance}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cls.avgPerformance}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={cn("h-full rounded-full", cls.avgPerformance >= 75 ? "bg-success" : cls.avgPerformance >= 60 ? "gradient-primary" : "bg-destructive")}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/teacher-digital-twin" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                          <Sparkles className="h-3 w-3" /> Digital Twin
                        </Button>
                      </Link>
                      <Link to="/teacher-create-assessment" className="flex-1">
                        <Button size="sm" className="w-full gradient-primary text-primary-foreground gap-1 text-xs">
                          <Plus className="h-3 w-3" /> Assessment <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* ─── STUDENT ROSTER TAB ─── */}
        <TabsContent value="students" className="mt-5">
          {/* Class selector */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => { setClassFilter("all"); setPage(1); }}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition",
                classFilter === "all"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-accent text-muted-foreground"
              )}
            >
              All Classes
              <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                {students.length}
              </span>
            </button>
            {myClasses.map((cls) => {
              const count = students.filter(s => s.classId === cls.id).length;
              return (
                <button
                  key={cls.id}
                  onClick={() => { setClassFilter(cls.id); setPage(1); }}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium transition",
                    classFilter === cls.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-accent text-muted-foreground"
                  )}
                >
                  {cls.name}
                  <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <GlassCard>
            {/* Context header */}
            {classFilter !== "all" && (() => {
              const selectedCls = myClasses.find(c => c.id === classFilter);
              return selectedCls ? (
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{selectedCls.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedCls.subject} · Grade {selectedCls.grade} · {selectedCls.semester}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-sm">{filtered.length}</div>
                    <div className="text-[10px] text-muted-foreground">students</div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search students…" className="pl-9" />
              </div>
              <Select value={risk} onValueChange={(v) => { setRisk(v); setPage(1); }}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-1 h-3.5 w-3.5" /><SelectValue />
                </SelectTrigger>
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

            {/* Table */}
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
                    <th className="py-3 font-medium text-right">View</th>
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
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={s.avatar} />
                            <AvatarFallback className="text-xs">{s.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{s.name}</span>
                        </div>
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
                      <td className="py-3 pr-4 font-semibold">{s.performance}%</td>
                      <td className="py-3 pr-4"><RiskBadge level={s.risk} /></td>
                      <td className="py-3 pr-4">{s.gaps}</td>
                      <td className="py-3 text-right">
                        <Link to="/students/$id" params={{ id: s.id }}>
                          <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs">
                            <Eye className="h-3.5 w-3.5" /> View
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                  {view.length === 0 && (
                    <tr><td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">No students match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Showing {view.length} of {filtered.length}</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs">Page {page} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

      </Tabs>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass rounded-3xl p-8 shadow-glow w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {!created ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold">Create New Class</h2>
                    <button onClick={() => setShowCreate(false)} className="rounded-lg p-2 hover:bg-accent"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="space-y-4">
                    <div><Label>Class Name</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Data Structures" /></div>
                    <div><Label>Subject</Label>
                      <div className="mt-1.5 grid grid-cols-2 gap-2">
                        {["Computer Science","Mathematics","Physics","Chemistry"].map((s) => (
                          <button key={s} type="button" onClick={() => setForm({ ...form, subject: s })}
                            className={cn("rounded-xl border px-3 py-2 text-xs font-medium transition", form.subject === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent")}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Grade</Label>
                        <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                          {["8","9","10","11","12"].map((g) => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                      <div><Label>Semester</Label>
                        <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                          <option>Semester 1 — 2025</option>
                          <option>Semester 2 — 2025</option>
                          <option>Semester 1 — 2026</option>
                        </select>
                      </div>
                    </div>
                    <Button className="w-full gradient-primary text-primary-foreground shadow-glow" onClick={() => setCreated(true)} disabled={!form.name}>
                      Create Class
                    </Button>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="font-display text-xl font-bold">Class Created!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">"{form.name}" has been added to your dashboard.</p>
                  <Button className="mt-6 gradient-primary text-primary-foreground"
                    onClick={() => { setShowCreate(false); setCreated(false); setForm({ name: "", subject: "Computer Science", grade: "11", semester: "Semester 2 — 2025" }); }}>
                    Done
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
