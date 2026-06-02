import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Clock, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Award,
  Sparkles, Bot, Target, Calendar, User as UserIcon, Play, ChevronRight, HelpCircle,
  Lightbulb, ArrowRight, Star
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { students } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/student-assessment")({
  head: () => ({ meta: [{ title: "Assessment Center — InsightEDU" }] }),
  component: AssessmentCenterPage,
});

const myStudent = students.find(s => s.risk === "high") ?? students[0];

// Mock Data for the Assessment Center
const availableAssessments = [
  { id: 1, title: "Trees and Graphs Quiz", subject: "Computer Science", topic: "Data Structures", teacher: "Mr. Kumar", questions: 20, duration: "30 mins", difficulty: "Medium", dueDate: "June 10", status: "new" },
  { id: 2, title: "Dynamic Programming Midterm", subject: "Computer Science", topic: "Algorithms", teacher: "Ms. Sharma", questions: 15, duration: "45 mins", difficulty: "Advanced", dueDate: "June 15", status: "in-progress" },
];

const assessmentHistory = [
  { id: 101, title: "Recursion Basics", date: "May 28", score: 68, classAvg: 61, timeTaken: "24 mins", confidence: "Low", aiSummary: "Good understanding of base cases, but weaknesses found in tracing call stacks and overlapping subproblems." },
  { id: 102, title: "Linked Lists Deep Dive", date: "May 15", score: 85, classAvg: 72, timeTaken: "20 mins", confidence: "High", aiSummary: "Excellent pointer manipulation. You mastered reversing lists!" },
  { id: 103, title: "Array Manipulation", date: "May 02", score: 92, classAvg: 75, timeTaken: "18 mins", confidence: "High", aiSummary: "Perfect execution of two-pointer techniques." },
];

const deepDiveData = {
  overallScore: 68,
  topics: [
    { name: "Arrays", score: 90 },
    { name: "Linked Lists", score: 85 },
    { name: "Trees", score: 72 },
    { name: "Recursion", score: 42 },
    { name: "Graphs", score: 35 },
  ],
  questions: [
    { q: "1. Which traversal method uses a Queue?", correct: "BFS", student: "DFS", status: "incorrect", topic: "Graph Traversal", diff: "Medium", aiExp: "You confused depth-first traversal (which uses a Stack/Recursion) with breadth-first traversal (which uses a Queue)." },
    { q: "2. Time complexity of BST worst case?", correct: "O(n)", student: "O(n)", status: "correct", topic: "Trees", diff: "Medium", aiExp: "Spot on! An unbalanced BST degrades to a linked list." },
    { q: "3. Max edges in a simple graph with N vertices?", correct: "N(N-1)/2", student: "N^2", status: "incorrect", topic: "Graph Theory", diff: "Advanced", aiExp: "N^2 includes self loops and directed edges. A simple undirected graph is N(N-1)/2." },
  ]
};

const improvementData = [
  { topic: "Recursion", before: 35, current: 62 },
  { topic: "Trees", before: 48, current: 79 },
  { topic: "Graphs", before: 30, current: 65 },
];

function AssessmentCenterPage() {
  const [activeTab, setActiveTab] = useState("available");
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);

  // Deep Dive View
  if (selectedHistory) {
    const historyItem = assessmentHistory.find(h => h.id === selectedHistory)!;
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedHistory(null)} className="gap-2">
            ← Back to History
          </Button>
          <div className="text-sm font-medium text-muted-foreground">Assessment Analytics</div>
        </div>

        <GlassCard>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">{historyItem.title}</h1>
              <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> Attempted: {historyItem.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4"/> Time: {historyItem.timeTaken}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-primary/10 rounded-2xl p-4 border border-primary/20">
                <div className="text-3xl font-bold text-primary">{historyItem.score}%</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold mt-1">Your Score</div>
              </div>
              <div className="text-center bg-muted/40 rounded-2xl p-4 border border-border/50">
                <div className="text-3xl font-bold text-muted-foreground">{historyItem.classAvg}%</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold mt-1">Class Avg</div>
              </div>
            </div>
          </div>

          {/* Feedback Blocks */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-warning" />
              <div className="flex items-center gap-2 font-semibold text-sm mb-2"><Bot className="h-4 w-4 text-warning"/> AI Feedback</div>
              <p className="text-sm text-muted-foreground">{historyItem.aiSummary}</p>
            </div>
            <div className="rounded-xl border border-success/30 bg-success/5 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-success" />
              <div className="flex items-center gap-2 font-semibold text-sm mb-2"><UserIcon className="h-4 w-4 text-success"/> Teacher Feedback</div>
              <p className="text-sm text-muted-foreground">"Great effort {myStudent.name.split(" ")[0]}. Let's focus on Graph Theory in our next 1-on-1 session."</p>
            </div>
          </div>
        </GlassCard>

        {/* Topic Performance */}
        <GlassCard title="Topic-wise Performance" action={<BarChart3 className="h-4 w-4 text-primary" />}>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {deepDiveData.topics.map(t => (
              <div key={t.name}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>{t.name}</span>
                  <span className={cn(t.score >= 75 ? "text-success" : t.score >= 50 ? "text-warning" : "text-destructive")}>{t.score}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${t.score}%` }} transition={{ duration: 1 }}
                    className={cn("h-full rounded-full", t.score >= 75 ? "bg-success" : t.score >= 50 ? "bg-warning" : "bg-destructive")} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Question Breakdown */}
        <GlassCard title="Question Breakdown" description="Review your mistakes and learn from AI explanations">
          <div className="space-y-4">
            {deepDiveData.questions.map((q, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-card/30 p-4">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h4 className="font-semibold">{q.q}</h4>
                  <Badge variant={q.status === "correct" ? "default" : "destructive"} className={q.status === "correct" ? "bg-success/20 text-success hover:bg-success/30" : ""}>
                    {q.status === "correct" ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 mb-3 text-sm">
                  <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
                    <span className="text-muted-foreground text-xs block mb-1">Your Answer:</span>
                    <span className={q.status === "correct" ? "text-success font-medium" : "text-destructive font-medium"}>{q.student}</span>
                  </div>
                  <div className="rounded-lg bg-success/10 p-2.5 border border-success/20">
                    <span className="text-muted-foreground text-xs block mb-1 text-success/80">Correct Answer:</span>
                    <span className="text-success font-medium">{q.correct}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-[10px] uppercase">{q.topic}</Badge>
                  <Badge variant="outline" className="text-[10px] uppercase">{q.diff}</Badge>
                </div>

                {q.status === "incorrect" && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex gap-3">
                    <Bot className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-primary mb-0.5">AI Explanation</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{q.aiExp}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  // Main Assessment Center
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-8">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow shrink-0">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-foreground">
                Assessment Center
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Attempt new quizzes, analyze past performance, and track your learning growth.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-2xl mb-6 overflow-x-auto">
          <TabsTrigger value="available" className="rounded-xl px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <div className="flex items-center gap-2"><FileText className="h-4 w-4"/> Available Assessments</div>
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <div className="flex items-center gap-2"><Clock className="h-4 w-4"/> Assessment History</div>
          </TabsTrigger>
          <TabsTrigger value="growth" className="rounded-xl px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Performance Growth</div>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: AVAILABLE ASSESSMENTS */}
        <TabsContent value="available" className="space-y-4 outline-none">
          {availableAssessments.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {availableAssessments.map((assessment, i) => (
                <motion.div key={assessment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="h-full flex flex-col hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className={cn("text-[10px] uppercase tracking-wider", 
                        assessment.status === "new" ? "bg-primary/20 text-primary border-primary/30" : "bg-warning/20 text-warning border-warning/30"
                      )}>
                        {assessment.status === "new" ? "🟢 New" : "🟡 In Progress"}
                      </Badge>
                      <div className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">Due: {assessment.dueDate}</div>
                    </div>
                    
                    <h3 className="font-display font-bold text-lg mb-1">{assessment.title}</h3>
                    <div className="text-sm text-muted-foreground mb-4">{assessment.subject} • {assessment.topic}</div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5"><HelpCircle className="h-3 w-3"/> Questions</span>
                        <span className="font-semibold">{assessment.questions}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3"/> Duration</span>
                        <span className="font-semibold">{assessment.duration}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Award className="h-3 w-3"/> Difficulty</span>
                        <span className="font-semibold">{assessment.difficulty}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5"><UserIcon className="h-3 w-3"/> Assigned By</span>
                        <span className="font-semibold">{assessment.teacher}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button className="w-full gradient-primary text-primary-foreground shadow-glow gap-2">
                        <Play className="h-4 w-4" /> Start Assessment
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <GlassCard className="py-20 text-center flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-display text-xl font-bold">All caught up!</h3>
              <p className="text-muted-foreground text-sm mt-2">No assessments assigned right now. Relax or review your past mistakes.</p>
            </GlassCard>
          )}
        </TabsContent>

        {/* TAB 2: ASSESSMENT HISTORY */}
        <TabsContent value="history" className="space-y-4 outline-none">
          <div className="space-y-4">
            {assessmentHistory.map((history, i) => (
              <motion.div key={history.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="hover:border-primary/30 transition-all p-5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display font-bold text-lg">{history.title}</h3>
                        <Badge variant="outline" className="text-[10px] bg-background">Attempted: {history.date}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">{history.aiSummary}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-md flex items-center gap-1"><Clock className="h-3 w-3"/> {history.timeTaken}</span>
                        <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-md">Confidence: {history.confidence}</span>
                        <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-md">Class Avg: {history.classAvg}%</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto gap-4 md:gap-2">
                      <div className="text-center">
                        <div className={cn("text-2xl font-bold", history.score >= 80 ? "text-success" : history.score >= 60 ? "text-primary" : "text-destructive")}>{history.score}%</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedHistory(history.id)} className="gap-2">
                        View Report <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: PERFORMANCE IMPROVEMENTS */}
        <TabsContent value="growth" className="space-y-6 outline-none">
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard label="Overall Improvement" value="+18%" icon={TrendingUp} tone="success" index={0} subtitle="Across all subjects" />
            <StatCard label="Mastery Growth" value="3 Topics" icon={Award} tone="primary" index={1} subtitle="Moved to >80%" />
            <StatCard label="Consistency" value="High" icon={Target} tone="warning" index={2} subtitle="Last 5 assessments" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Learning Insights */}
            <GlassCard title="AI Learning Insights" action={<Bot className="h-4 w-4 text-primary" />}>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center shrink-0"><TrendingUp className="h-4 w-4 text-success" /></div>
                  <div>
                    <div className="font-semibold text-sm">Consistent Growth</div>
                    <p className="text-xs text-muted-foreground">Your Graph concepts improved by 35% in the last 3 assessments.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center shrink-0"><AlertTriangle className="h-4 w-4 text-destructive" /></div>
                  <div>
                    <div className="font-semibold text-sm">Recurring Weakness</div>
                    <p className="text-xs text-muted-foreground">You consistently lose marks in recursive problem-solving and base-case tracing.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Lightbulb className="h-4 w-4 text-primary" /></div>
                  <div>
                    <div className="font-semibold text-sm">AI Recommendation</div>
                    <p className="text-xs text-muted-foreground">Completing the Recursion Learning Path can increase your next assessment score by approx 15%.</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Assessment Comparison */}
            <GlassCard title="Assessment Comparison" description="Your journey across similar quizzes">
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {[
                  { title: "Trees Quiz", score: 52 },
                  { title: "Trees & Graphs Quiz", score: 68 },
                  { title: "Advanced Trees Quiz", score: 81 },
                ].map((c, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Star className="h-4 w-4"/>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border/50 bg-background/50 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm">{c.title}</span>
                        <span className={cn("font-bold", c.score >= 80 ? "text-success" : c.score >= 60 ? "text-primary" : "text-muted-foreground")}>{c.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Badge className="bg-success/20 text-success border-success/30 px-4 py-1.5 text-sm">📈 +29% Overall Improvement</Badge>
              </div>
            </GlassCard>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Topic Improvement Tracker */}
            <GlassCard title="Topic Improvement Tracker" description="Before vs Current Mastery">
              <div className="overflow-hidden rounded-xl border border-border/50">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Topic</th>
                      <th className="px-4 py-3 font-semibold text-center">Before</th>
                      <th className="px-4 py-3 font-semibold text-center">Current</th>
                      <th className="px-4 py-3 font-semibold text-right">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {improvementData.map((t, i) => (
                      <motion.tr key={t.topic} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-card/30 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{t.topic}</td>
                        <td className="px-4 py-3 text-center text-muted-foreground">{t.before}%</td>
                        <td className="px-4 py-3 text-center font-bold text-foreground">{t.current}%</td>
                        <td className="px-4 py-3 text-right text-success font-bold">+{t.current - t.before}%</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Next Recommended */}
            <GlassCard title="Next Recommended Assessment" description="Based on your current weaknesses" action={<Sparkles className="h-4 w-4 text-warning" />}>
              <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background p-5 text-center flex flex-col items-center h-full justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1">Recursion Mastery Test</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                  Your current mastery is at 42%. Taking this targeted quiz will identify exact gaps.
                </p>
                <div className="bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                  Expected Improvement: +15%
                </div>
                <Button className="gradient-primary text-primary-foreground shadow-glow gap-2 w-full max-w-xs">
                  Attempt Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </GlassCard>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}
