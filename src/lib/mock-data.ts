export const stats = {
  totalStudents: 248,
  activeStudents: 192,
  atRiskStudents: 34,
  avgPerformance: 78.4,
  learningGapAlerts: 12,
};

export const weeklyPerformance = [
  { day: "Mon", score: 72, engagement: 80 },
  { day: "Tue", score: 75, engagement: 78 },
  { day: "Wed", score: 78, engagement: 82 },
  { day: "Thu", score: 74, engagement: 75 },
  { day: "Fri", score: 81, engagement: 88 },
  { day: "Sat", score: 79, engagement: 70 },
  { day: "Sun", score: 83, engagement: 65 },
];

export const monthlyProgress = [
  { month: "Jan", mastery: 62 },
  { month: "Feb", mastery: 65 },
  { month: "Mar", mastery: 68 },
  { month: "Apr", mastery: 71 },
  { month: "May", mastery: 74 },
  { month: "Jun", mastery: 78 },
  { month: "Jul", mastery: 82 },
];

export const topicMastery = [
  { topic: "Arrays", mastered: 95, struggling: 5 },
  { topic: "Linked Lists", mastered: 82, struggling: 18 },
  { topic: "Stacks", mastered: 88, struggling: 12 },
  { topic: "Queues", mastered: 79, struggling: 21 },
  { topic: "Trees", mastered: 52, struggling: 48 },
  { topic: "Graphs", mastered: 38, struggling: 62 },
  { topic: "DP", mastered: 41, struggling: 59 },
];

export const learningGaps = [
  { topic: "Arrays", count: 5, intensity: 0.1 },
  { topic: "Linked Lists", count: 12, intensity: 0.3 },
  { topic: "Stacks", count: 8, intensity: 0.2 },
  { topic: "Queues", count: 11, intensity: 0.28 },
  { topic: "Recursion", count: 22, intensity: 0.55 },
  { topic: "Trees", count: 28, intensity: 0.7 },
  { topic: "Graphs", count: 31, intensity: 0.78 },
  { topic: "DP", count: 35, intensity: 0.88 },
  { topic: "Sorting", count: 9, intensity: 0.22 },
  { topic: "Hashing", count: 14, intensity: 0.35 },
  { topic: "Greedy", count: 18, intensity: 0.45 },
  { topic: "Bit Magic", count: 7, intensity: 0.18 },
];

export const aiInsights = [
  { id: 1, title: "32 students struggle with Graph Traversal", root: "Recursion fundamentals", confidence: 92, severity: "high" as const },
  { id: 2, title: "Performance declined 12% this week in Class 10-B", root: "Missed prerequisite topic", confidence: 87, severity: "medium" as const },
  { id: 3, title: "Tree Traversal mastery up 18%", root: "New visualization module", confidence: 95, severity: "low" as const },
];

export const recentAlerts = [
  { id: 1, type: "risk", title: "Aanya Sharma flagged at risk", time: "2m ago", priority: "high" as const },
  { id: 2, type: "gap", title: "New learning gap: Dynamic Programming", time: "15m ago", priority: "medium" as const },
  { id: 3, type: "rec", title: "AI recommendation generated for Class 9-A", time: "1h ago", priority: "low" as const },
  { id: 4, type: "risk", title: "Engagement dip detected in Period 4", time: "2h ago", priority: "medium" as const },
];

export type Student = {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  performance: number;
  risk: "low" | "medium" | "high";
  gaps: number;
  avatar: string;
};

const names = ["Aanya Sharma","Rohan Mehta","Priya Patel","Arjun Kapoor","Diya Singh","Kabir Nair","Ishaan Reddy","Sara Khan","Vivaan Iyer","Anika Bose","Reyansh Gupta","Myra Joshi","Aditya Rao","Kiara Das","Vihaan Shah","Saanvi Pillai","Aarav Verma","Tara Malhotra","Dhruv Saxena","Pari Menon","Krish Bhatt","Avni Roy","Ayaan Chawla","Riya Sen","Atharv Jain"];

export const students: Student[] = names.map((name, i) => ({
  id: `s-${i + 1}`,
  name,
  grade: ["8","9","10","11","12"][i % 5],
  attendance: 70 + ((i * 7) % 30),
  performance: 45 + ((i * 13) % 55),
  risk: i % 5 === 0 ? "high" : i % 3 === 0 ? "medium" : "low",
  gaps: (i * 3) % 9,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
}));

export const studentMastery = [
  { topic: "Arrays", mastery: 92 },
  { topic: "Linked Lists", mastery: 80 },
  { topic: "Stacks", mastery: 75 },
  { topic: "Trees", mastery: 45 },
  { topic: "Graphs", mastery: 38 },
  { topic: "DP", mastery: 30 },
];

export const studentTimeline = [
  { week: "W1", score: 55 },
  { week: "W2", score: 60 },
  { week: "W3", score: 58 },
  { week: "W4", score: 64 },
  { week: "W5", score: 70 },
  { week: "W6", score: 72 },
  { week: "W7", score: 78 },
];

export const classroomLive = {
  topic: "Graph Traversal — BFS",
  engagement: 78,
  participation: 64,
  understood: 65,
  partial: 20,
  confused: 15,
};

export const notifications = [
  { id: 1, type: "risk", title: "Aanya Sharma flagged at risk", body: "Performance declined 18% over 2 weeks", time: "2m ago", read: false, priority: "high" as const },
  { id: 2, type: "gap", title: "New learning gap detected", body: "32 students struggling with Graphs", time: "15m ago", read: false, priority: "medium" as const },
  { id: 3, type: "rec", title: "Recommendation generated", body: "Personalized practice set for Class 9-A", time: "1h ago", read: true, priority: "low" as const },
  { id: 4, type: "done", title: "Assignment completed", body: "Recursion practice — 28/30 students", time: "3h ago", read: true, priority: "low" as const },
];

export const achievements = [
  { id: 1, title: "Tree Master", desc: "Completed all Tree modules", icon: "🌳" },
  { id: 2, title: "7-Day Streak", desc: "Practiced 7 days in a row", icon: "🔥" },
  { id: 3, title: "Recursion Hero", desc: "Solved 25 recursion problems", icon: "🧠" },
  { id: 4, title: "Top 10%", desc: "Ranked in top performers", icon: "🏆" },
];
