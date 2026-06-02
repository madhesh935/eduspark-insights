import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronRight, ChevronLeft, Plus, Trash2, BookOpen, Clock, Users, Tag,
  BarChart3, X, CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { assessments, classes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/teacher-create-assessment")({
  head: () => ({ meta: [{ title: "Assessments — InsightEDU" }] }),
  component: AssessmentsPage,
});

type QuestionDraft = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  topic: string;
  subtopic: string;
  difficulty: "easy" | "medium" | "hard";
  learningOutcome: string;
};

const steps = ["Quiz Details", "Add Questions", "Assign & Schedule"];
const topics = ["Arrays", "Linked Lists", "Stacks", "Queues", "Recursion", "Trees", "Graphs", "Dynamic Programming", "Sorting", "Hashing"];
const myClassIds = ["c1", "c2", "c3"];

function AssessmentsPage() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [step, setStep]   = useState(0);
  const [details, setDetails] = useState({ title: "", subject: "Computer Science", classId: "c1", duration: 30, questionCount: 20 });
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [currentQ, setCurrentQ] = useState<QuestionDraft>({
    id: `q-${Date.now()}`, text: "", options: ["", "", "", ""], correctIndex: 0,
    topic: "Graphs", subtopic: "Traversal", difficulty: "medium", learningOutcome: "",
  });
  const [published, setPublished] = useState(false);

  const allAssessments = assessments.filter(a => myClassIds.includes(a.classId));

  const addQuestion = () => {
    if (!currentQ.text) return;
    setQuestions(prev => [...prev, { ...currentQ, id: `q-${Date.now()}` }]);
    setCurrentQ({ id: `q-${Date.now()+1}`, text: "", options: ["","","",""], correctIndex: 0, topic: "Graphs", subtopic: "Traversal", difficulty: "medium", learningOutcome: "" });
  };

  const resetCreate = () => {
    setStep(0); setPublished(false); setQuestions([]);
    setDetails({ title: "", subject: "Computer Science", classId: "c1", duration: 30, questionCount: 20 });
    setCurrentQ({ id: `q-${Date.now()}`, text: "", options: ["","","",""], correctIndex: 0, topic: "Graphs", subtopic: "Traversal", difficulty: "medium", learningOutcome: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Assessments</h1>
          <p className="text-sm text-muted-foreground">View past assessments and create new ones for your classes.</p>
        </div>
        <Button
          onClick={() => { setShowCreate(v => !v); if (published) { resetCreate(); } }}
          className={cn("gap-2 shadow-glow", showCreate ? "bg-muted text-foreground border border-border" : "gradient-primary text-primary-foreground")}
        >
          {showCreate ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Create Assessment</>}
        </Button>
      </div>

      {/* ── Create Assessment – inline collapsible ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            key="create-panel"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-auto max-w-3xl space-y-5 pb-2">
              {/* Step Indicator */}
              {!published && (
                <div className="flex items-center gap-2">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                        i < step  ? "gradient-primary text-primary-foreground" :
                        i === step ? "bg-primary/20 text-primary ring-2 ring-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {i < step ? <Check className="h-4 w-4" /> : i + 1}
                      </div>
                      <span className={cn("text-sm font-medium hidden sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                      {i < steps.length - 1 && <div className={cn("h-px flex-1 transition-all", i < step ? "bg-primary" : "bg-border")} />}
                    </div>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* STEP 0 */}
                {step === 0 && !published && (
                  <motion.div key="s0" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                    <GlassCard title="Quiz Details" description="Basic information about this assessment">
                      <div className="space-y-4">
                        <div>
                          <Label>Quiz Name</Label>
                          <Input className="mt-1.5" placeholder="e.g. Trees and Graphs Quiz" value={details.title} onChange={e => setDetails({...details, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Subject</Label>
                            <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={details.subject} onChange={e => setDetails({...details, subject: e.target.value})}>
                              {["Computer Science","Mathematics","Physics","Chemistry","English"].map(s => <option key={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label>Assign to Class</Label>
                            <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={details.classId} onChange={e => setDetails({...details, classId: e.target.value})}>
                              <option value="c1">Data Structures (Gr.11)</option>
                              <option value="c2">Algorithms (Gr.12)</option>
                              <option value="c3">Web Development (Gr.10)</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label><Clock className="inline h-3.5 w-3.5 mr-1" />Duration (minutes)</Label>
                            <Input type="number" className="mt-1.5" value={details.duration} onChange={e => setDetails({...details, duration: Number(e.target.value)})} />
                          </div>
                          <div>
                            <Label><BookOpen className="inline h-3.5 w-3.5 mr-1" />Number of Questions</Label>
                            <Input type="number" className="mt-1.5" value={details.questionCount} onChange={e => setDetails({...details, questionCount: Number(e.target.value)})} />
                          </div>
                        </div>
                        {details.title && (
                          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Preview</div>
                            <div className="mt-1 font-display font-bold text-lg">{details.title}</div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{details.subject}</span>
                              <span className="rounded-full bg-muted px-2 py-0.5"><Clock className="inline h-3 w-3 mr-1" />{details.duration}m</span>
                              <span className="rounded-full bg-muted px-2 py-0.5"><BookOpen className="inline h-3 w-3 mr-1" />{details.questionCount} questions</span>
                            </div>
                          </motion.div>
                        )}
                        <Button className="w-full gradient-primary text-primary-foreground shadow-glow" onClick={() => setStep(1)} disabled={!details.title}>
                          Continue <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* STEP 1 */}
                {step === 1 && !published && (
                  <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-4">
                    {questions.length > 0 && (
                      <GlassCard title={`Questions Added (${questions.length})`}>
                        <div className="space-y-2">
                          {questions.map((q, i) => (
                            <div key={q.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3 hover:bg-accent/40 transition">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">{i+1}</div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{q.text}</div>
                                <div className="flex gap-1 mt-1">
                                  <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px]">{q.topic}</span>
                                  <span className={cn("rounded-full px-2 py-0.5 text-[10px]",
                                    q.difficulty==="hard"?"bg-destructive/10 text-destructive":q.difficulty==="medium"?"bg-warning/10 text-warning":"bg-success/10 text-success"
                                  )}>{q.difficulty}</span>
                                </div>
                              </div>
                              <button onClick={() => setQuestions(p => p.filter((_,j) => j!==i))} className="text-muted-foreground hover:text-destructive transition">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    )}
                    <GlassCard title="Add Question" description="Tag each question with topic, difficulty and learning outcome">
                      <div className="space-y-4">
                        <div>
                          <Label>Question Text</Label>
                          <Input className="mt-1.5" placeholder="e.g. What is the time complexity of DFS?" value={currentQ.text} onChange={e => setCurrentQ({...currentQ, text: e.target.value})} />
                        </div>
                        <div>
                          <Label>Answer Options</Label>
                          <div className="mt-1.5 grid grid-cols-2 gap-2">
                            {currentQ.options.map((opt, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                <button type="button" onClick={() => setCurrentQ({...currentQ, correctIndex: i})}
                                  className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition",
                                    currentQ.correctIndex===i?"border-success bg-success text-white":"border-border text-muted-foreground hover:border-primary/50"
                                  )}>{String.fromCharCode(65+i)}</button>
                                <Input placeholder={`Option ${String.fromCharCode(65+i)}`} value={opt} onChange={e => {
                                  const o=[...currentQ.options]; o[i]=e.target.value; setCurrentQ({...currentQ, options:o});
                                }} />
                              </div>
                            ))}
                          </div>
                          <p className="mt-1.5 text-[10px] text-muted-foreground">Click the letter to mark the correct answer</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label><Tag className="inline h-3.5 w-3.5 mr-1" />Topic</Label>
                            <select className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={currentQ.topic} onChange={e => setCurrentQ({...currentQ, topic: e.target.value})}>
                              {topics.map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label>Subtopic</Label>
                            <Input className="mt-1.5" placeholder="e.g. Traversal" value={currentQ.subtopic} onChange={e => setCurrentQ({...currentQ, subtopic: e.target.value})} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Difficulty</Label>
                            <div className="mt-1.5 flex gap-2">
                              {(["easy","medium","hard"] as const).map(d => (
                                <button key={d} type="button" onClick={() => setCurrentQ({...currentQ, difficulty: d})}
                                  className={cn("flex-1 rounded-xl border px-2 py-1.5 text-xs font-medium capitalize transition",
                                    currentQ.difficulty===d
                                      ? d==="easy"?"border-success bg-success/10 text-success"
                                        : d==="medium"?"border-warning bg-warning/10 text-warning"
                                        : "border-destructive bg-destructive/10 text-destructive"
                                      : "border-border hover:bg-accent"
                                  )}>{d}</button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Learning Outcome</Label>
                            <Input className="mt-1.5" placeholder="e.g. Understand DFS" value={currentQ.learningOutcome} onChange={e => setCurrentQ({...currentQ, learningOutcome: e.target.value})} />
                          </div>
                        </div>
                        <Button type="button" className="w-full gradient-primary text-primary-foreground" onClick={addQuestion} disabled={!currentQ.text}>
                          <Plus className="mr-1.5 h-4 w-4" /> Add Question
                        </Button>
                      </div>
                    </GlassCard>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(0)} className="gap-1"><ChevronLeft className="h-4 w-4" /> Back</Button>
                      <Button className="flex-1 gradient-primary text-primary-foreground" onClick={() => setStep(2)} disabled={questions.length===0}>
                        Continue ({questions.length} questions) <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && !published && (
                  <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                    <GlassCard title="Assign & Schedule" description="Set availability and publish your assessment">
                      <div className="space-y-5">
                        <div className="rounded-2xl border border-border bg-muted/30 p-4">
                          <div className="font-semibold">{details.title}</div>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span><Clock className="inline h-3 w-3 mr-0.5" />{details.duration} minutes</span>
                            <span><BookOpen className="inline h-3 w-3 mr-0.5" />{questions.length} questions</span>
                            <span><Users className="inline h-3 w-3 mr-0.5" />60 students</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {[...new Set(questions.map(q=>q.topic))].map(t => (
                              <span key={t} className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px]">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label>Available From</Label><Input type="datetime-local" className="mt-1.5" defaultValue="2025-06-03T09:00" /></div>
                          <div><Label>Due By</Label><Input type="datetime-local" className="mt-1.5" defaultValue="2025-06-04T23:59" /></div>
                        </div>
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                          <div className="text-sm font-medium text-primary">AI Analysis — Automatically enabled</div>
                          <div className="mt-1 text-xs text-muted-foreground">After students submit, AI will detect gaps, trace root causes, and generate personalised learning paths.</div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setStep(1)} className="gap-1"><ChevronLeft className="h-4 w-4" /> Back</Button>
                          <Button className="flex-1 gradient-primary text-primary-foreground shadow-glow" onClick={() => setPublished(true)}>
                            Publish Assessment 🚀
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Success */}
                {published && (
                  <motion.div key="done" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
                    <GlassCard>
                      <div className="py-6 text-center">
                        <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:0.5 }}
                          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                          <CheckCircle2 className="h-8 w-8 text-success" />
                        </motion.div>
                        <h2 className="font-display text-xl font-bold">Assessment Published!</h2>
                        <p className="mt-1 text-muted-foreground text-sm">"{details.title}" is now live for 60 students.</p>
                        <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
                          <span className="rounded-full bg-muted px-3 py-1">{questions.length} questions</span>
                          <span className="rounded-full bg-muted px-3 py-1">{details.duration} minutes</span>
                          <span className="rounded-full bg-success/10 text-success px-3 py-1">Live now</span>
                        </div>
                        <Button className="mt-5 gradient-primary text-primary-foreground shadow-glow gap-2"
                          onClick={() => { resetCreate(); setShowCreate(false); }}>
                          <BarChart3 className="h-4 w-4" /> Back to Assessments
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Previous Assessments — always visible ── */}
      <GlassCard title="Previous Assessments" description={`${allAssessments.length} assessments across all classes`} action={<BarChart3 className="h-4 w-4 text-primary" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Assessment</th>
                <th className="py-3 pr-4 font-medium">Class</th>
                <th className="py-3 pr-4 font-medium">Attempts</th>
                <th className="py-3 pr-4 font-medium">Duration</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {allAssessments.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
                  className="border-b last:border-0 hover:bg-accent/30 transition">
                  <td className="py-3 pr-4 font-medium">{a.title}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{classes.find(c => c.id===a.classId)?.name}</td>
                  <td className="py-3 pr-4">{a.attemptCount} / {classes.find(c => c.id===a.classId)?.studentCount ?? 0}</td>
                  <td className="py-3 pr-4 text-muted-foreground"><Clock className="inline h-3 w-3 mr-1" />{a.duration}m</td>
                  <td className="py-3">
                    <Badge
                      variant={a.status==="completed"?"secondary":a.status==="active"?"default":"outline"}
                      className={cn(a.status==="active" && "bg-success/15 text-success border-success/30")}
                    >
                      {a.status==="active" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-success animate-pulse inline-block" />}
                      {a.status}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
