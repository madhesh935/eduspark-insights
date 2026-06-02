// ============================================================
// InsightEDU — Full Mock Data Ecosystem
// 5 teachers · 100 students · 10 subjects · 20 assessments · 500+ attempts
// ============================================================

// ─── Types ───────────────────────────────────────────────────

export type Teacher = {
  id: string;
  name: string;
  email: string;
  subject: string;
  department: string;
  classCount: number;
  studentCount: number;
  avatar: string;
};

export type ClassRoom = {
  id: string;
  name: string;
  subject: string;
  grade: string;
  semester: string;
  teacherId: string;
  studentCount: number;
  activeAssessments: number;
  gapAlerts: number;
  avgPerformance: number;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  topic: string;
  subtopic: string;
  difficulty: "easy" | "medium" | "hard";
  learningOutcome: string;
};

export type Assessment = {
  id: string;
  title: string;
  classId: string;
  subject: string;
  questionCount: number;
  duration: number;
  questions: Question[];
  status: "draft" | "active" | "completed";
  createdAt: string;
  attemptCount: number;
};

export type AttemptAnswer = {
  questionId: string;
  selectedIndex: number;
  timeTaken: number;
  confidence: "very-confident" | "confident" | "unsure" | "guessing";
  isCorrect: boolean;
};

export type Attempt = {
  id: string;
  studentId: string;
  assessmentId: string;
  answers: AttemptAnswer[];
  submittedAt: string;
  totalScore: number;
  topicScores: Record<string, number>;
};

export type Student = {
  id: string;
  name: string;
  grade: string;
  classId: string;
  teacherId: string;
  parentId: string;
  attendance: number;
  performance: number;
  risk: "low" | "medium" | "high";
  gaps: number;
  avatar: string;
  topicMastery: Record<string, number>;
  weakTopics: string[];
  rootCause: string;
  learningPath: string[];
};

export type Parent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  childIds: string[];
};

export type DependencyNode = {
  topic: string;
  requires: string[];
  level: number;
};

// ─── Knowledge Dependency Tree (CS) ──────────────────────────

export const csDependencyTree: DependencyNode[] = [
  { topic: "Programming Fundamentals", requires: [], level: 0 },
  { topic: "Functions", requires: ["Programming Fundamentals"], level: 1 },
  { topic: "Arrays", requires: ["Programming Fundamentals"], level: 1 },
  { topic: "Recursion", requires: ["Functions"], level: 2 },
  { topic: "Linked Lists", requires: ["Arrays", "Functions"], level: 2 },
  { topic: "Stacks", requires: ["Arrays", "Linked Lists"], level: 3 },
  { topic: "Queues", requires: ["Arrays", "Linked Lists"], level: 3 },
  { topic: "Sorting", requires: ["Arrays", "Recursion"], level: 3 },
  { topic: "Trees", requires: ["Recursion", "Linked Lists"], level: 4 },
  { topic: "Hashing", requires: ["Arrays"], level: 3 },
  { topic: "Graphs", requires: ["Trees", "Recursion"], level: 5 },
  { topic: "Dynamic Programming", requires: ["Recursion", "Arrays"], level: 5 },
];

export const csChain = [
  "Programming Fundamentals",
  "Functions",
  "Recursion",
  "Trees",
  "Graphs",
];

// ─── Teachers ────────────────────────────────────────────────

export const teachers: Teacher[] = [
  { id: "t1", name: "Sara Rao", email: "sara@insightedu.io", subject: "Computer Science", department: "Technology", classCount: 3, studentCount: 60, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara" },
  { id: "t2", name: "Rohit Sharma", email: "rohit@insightedu.io", subject: "Mathematics", department: "Science", classCount: 4, studentCount: 80, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohit" },
  { id: "t3", name: "Priya Nair", email: "priya@insightedu.io", subject: "Physics", department: "Science", classCount: 3, studentCount: 60, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
  { id: "t4", name: "Arjun Menon", email: "arjun@insightedu.io", subject: "Chemistry", department: "Science", classCount: 2, studentCount: 40, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun" },
  { id: "t5", name: "Diya Kapoor", email: "diya@insightedu.io", subject: "English", department: "Humanities", classCount: 3, studentCount: 60, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diya" },
];

// ─── Classes ─────────────────────────────────────────────────

export const classes: ClassRoom[] = [
  { id: "c1", name: "Data Structures", subject: "Computer Science", grade: "11", semester: "Semester 2 — 2025", teacherId: "t1", studentCount: 60, activeAssessments: 2, gapAlerts: 8, avgPerformance: 72 },
  { id: "c2", name: "Algorithms", subject: "Computer Science", grade: "12", semester: "Semester 1 — 2025", teacherId: "t1", studentCount: 45, activeAssessments: 1, gapAlerts: 5, avgPerformance: 68 },
  { id: "c3", name: "Web Development", subject: "Computer Science", grade: "10", semester: "Semester 2 — 2025", teacherId: "t1", studentCount: 38, activeAssessments: 0, gapAlerts: 2, avgPerformance: 81 },
  { id: "c4", name: "Calculus", subject: "Mathematics", grade: "11", semester: "Semester 2 — 2025", teacherId: "t2", studentCount: 55, activeAssessments: 3, gapAlerts: 10, avgPerformance: 65 },
  { id: "c5", name: "Statistics", subject: "Mathematics", grade: "12", semester: "Semester 1 — 2025", teacherId: "t2", studentCount: 48, activeAssessments: 1, gapAlerts: 4, avgPerformance: 74 },
];

// ─── Generate 100 Students ───────────────────────────────────

const firstNames = ["Aanya","Rohan","Priya","Arjun","Diya","Kabir","Ishaan","Sara","Vivaan","Anika","Reyansh","Myra","Aditya","Kiara","Vihaan","Saanvi","Aarav","Tara","Dhruv","Pari","Krish","Avni","Ayaan","Riya","Atharv","Jiya","Dev","Ananya","Siddharth","Meera","Parth","Shreya","Yash","Aarohi","Karan","Nisha","Rahul","Pooja","Nikhil","Simran","Aakash","Divya","Mohit","Ritika","Vijay","Sakshi","Amit","Prerna","Ankur","Deepika","Raj","Swati","Manish","Kavya","Suresh","Neha","Vikram","Ankita","Ajay","Sneha","Ravi","Bhavna","Sanjay","Madhuri","Gaurav","Pallavi","Sumit","Namrata","Harish","Sunita","Tarun","Heena","Vivek","Rekha","Varun","Geeta","Rohit2","Lata","Ajit","Sonal","Vinay","Preeti","Sachin","Neetu","Anand","Komal","Sharad","Juhi","Lalit","Sheela","Ashish","Puja","Hemant","Rashmi","Sunil","Usha","Kiran","Shweta","Neeraj","Mamta"];
const lastNames = ["Sharma","Mehta","Patel","Kapoor","Singh","Nair","Reddy","Khan","Iyer","Bose","Gupta","Joshi","Rao","Das","Shah","Pillai","Verma","Malhotra","Saxena","Menon","Bhatt","Roy","Chawla","Sen","Jain","Mishra","Pandey","Tiwari","Dubey","Srivastava","Kumar","Agarwal","Goel","Bansal","Khanna","Chopra","Arora","Bhatia","Sethi","Anand","Ghosh","Mukherjee","Chatterjee","Chakraborty","Biswas","Paul","Dey","Mitra","Sarkar","Dutta"];

const csTopics = ["Arrays","Linked Lists","Stacks","Queues","Recursion","Trees","Graphs","Dynamic Programming","Sorting","Hashing"];
const weakTopicSets = [
  { weak: ["Trees","Graphs"], root: "Recursion", path: ["Recursion Basics","Recursive Problems","Tree Traversal","Binary Search Trees","Graphs"] },
  { weak: ["Dynamic Programming"], root: "Recursion", path: ["Recursion Basics","Memoization","Tabulation","DP Patterns","Advanced DP"] },
  { weak: ["Graphs","Sorting"], root: "Arrays", path: ["Array Manipulation","Sorting Algorithms","Graph Representation","BFS","DFS"] },
  { weak: ["Stacks","Queues"], root: "Linked Lists", path: ["Linked List Basics","Stack Implementation","Queue Implementation","Monotonic Stack"] },
  { weak: [], root: "", path: [] },
];

function generateMastery(riskLevel: "low"|"medium"|"high", weakSet: typeof weakTopicSets[0]) {
  const mastery: Record<string, number> = {};
  for (const topic of csTopics) {
    const isWeak = weakSet.weak.includes(topic) || topic === weakSet.root;
    if (riskLevel === "high") {
      mastery[topic] = isWeak ? 25 + Math.floor(Math.random() * 20) : 55 + Math.floor(Math.random() * 25);
    } else if (riskLevel === "medium") {
      mastery[topic] = isWeak ? 45 + Math.floor(Math.random() * 20) : 70 + Math.floor(Math.random() * 20);
    } else {
      mastery[topic] = isWeak ? 60 + Math.floor(Math.random() * 20) : 80 + Math.floor(Math.random() * 20);
    }
  }
  return mastery;
}

export const students: Student[] = Array.from({ length: 100 }, (_, i) => {
  const firstName = firstNames[i] || `Student${i}`;
  const lastName = lastNames[i % lastNames.length];
  const name = `${firstName} ${lastName}`;
  const risk: "low"|"medium"|"high" = i % 7 === 0 ? "high" : i % 3 === 0 ? "medium" : "low";
  const weakSetIdx = risk === "high" ? (i % 3) : risk === "medium" ? (3) : 4;
  const weakSet = weakTopicSets[weakSetIdx];
  const performance = risk === "high" ? 35 + (i * 7 % 25) : risk === "medium" ? 58 + (i * 5 % 20) : 72 + (i * 3 % 20);
  const classId = `c${(i % 5) + 1}`;
  return {
    id: `s${i + 1}`,
    name,
    grade: ["8","9","10","11","12"][i % 5],
    classId,
    teacherId: classes.find(c => c.id === classId)?.teacherId ?? "t1",
    parentId: `p${i + 1}`,
    attendance: 65 + (i * 7 % 30),
    performance,
    risk,
    gaps: weakSet.weak.length,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    topicMastery: generateMastery(risk, weakSet),
    weakTopics: weakSet.weak,
    rootCause: weakSet.root,
    learningPath: weakSet.path,
  };
});

// ─── Parents ─────────────────────────────────────────────────

export const parents: Parent[] = students.map((s, i) => ({
  id: `p${i + 1}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
  email: `parent${i + 1}@gmail.com`,
  phone: `+91 9${String(800000000 + i * 7).slice(0,9)}`,
  childIds: [s.id],
}));

// ─── Assessment Questions (Trees & Graphs) ───────────────────

export const treesAndGraphsQuestions: Question[] = [
  { id: "q1", text: "What is the time complexity of DFS on a graph with V vertices and E edges?", options: ["O(V)", "O(E)", "O(V+E)", "O(V×E)"], correctIndex: 2, topic: "Graphs", subtopic: "Traversal", difficulty: "medium", learningOutcome: "Understand graph traversal complexity" },
  { id: "q2", text: "Which data structure is used internally by BFS?", options: ["Stack", "Queue", "Heap", "Tree"], correctIndex: 1, topic: "Graphs", subtopic: "Traversal", difficulty: "easy", learningOutcome: "Identify BFS data structure" },
  { id: "q3", text: "What is the height of a complete binary tree with 7 nodes?", options: ["2", "3", "4", "5"], correctIndex: 0, topic: "Trees", subtopic: "Properties", difficulty: "easy", learningOutcome: "Calculate tree height" },
  { id: "q4", text: "In an inorder traversal of a BST, which sequence is produced?", options: ["Random", "Ascending", "Descending", "Level order"], correctIndex: 1, topic: "Trees", subtopic: "Traversal", difficulty: "medium", learningOutcome: "Understand BST inorder property" },
  { id: "q5", text: "What is a recursive base case for tree traversal?", options: ["Root is null", "Node has two children", "Node is a leaf", "Tree height is 1"], correctIndex: 0, topic: "Recursion", subtopic: "Base Case", difficulty: "medium", learningOutcome: "Apply recursion to trees" },
  { id: "q6", text: "Dijkstra's algorithm is used for?", options: ["Topological sort", "Shortest path", "Minimum spanning tree", "Cycle detection"], correctIndex: 1, topic: "Graphs", subtopic: "Shortest Path", difficulty: "hard", learningOutcome: "Apply Dijkstra's algorithm" },
  { id: "q7", text: "Which traversal visits root first?", options: ["Inorder", "Postorder", "Preorder", "Level order"], correctIndex: 2, topic: "Trees", subtopic: "Traversal", difficulty: "easy", learningOutcome: "Distinguish tree traversals" },
  { id: "q8", text: "A graph with no cycles is called?", options: ["Complete graph", "DAG", "Bipartite", "Planar"], correctIndex: 1, topic: "Graphs", subtopic: "Properties", difficulty: "medium", learningOutcome: "Identify DAG properties" },
  { id: "q9", text: "What is the recurrence for Fibonacci using recursion?", options: ["F(n)=F(n-1)", "F(n)=F(n-1)+F(n-2)", "F(n)=2×F(n-1)", "F(n)=F(n/2)"], correctIndex: 1, topic: "Recursion", subtopic: "Examples", difficulty: "easy", learningOutcome: "Write recursive recurrences" },
  { id: "q10", text: "AVL trees maintain balance using?", options: ["Rotations", "Coloring", "Hashing", "Sorting"], correctIndex: 0, topic: "Trees", subtopic: "Balanced Trees", difficulty: "hard", learningOutcome: "Understand AVL balancing" },
  { id: "q11", text: "What is the space complexity of DFS using recursion?", options: ["O(1)", "O(V)", "O(E)", "O(V+E)"], correctIndex: 1, topic: "Graphs", subtopic: "Complexity", difficulty: "hard", learningOutcome: "Analyze DFS space complexity" },
  { id: "q12", text: "A binary search tree search runs in?", options: ["O(1)", "O(log n) average", "O(n) always", "O(n²)"], correctIndex: 1, topic: "Trees", subtopic: "BST Operations", difficulty: "medium", learningOutcome: "Analyze BST search complexity" },
  { id: "q13", text: "Which graph algorithm detects negative weight cycles?", options: ["Dijkstra", "Bellman-Ford", "Floyd-Warshall", "Kruskal"], correctIndex: 1, topic: "Graphs", subtopic: "Shortest Path", difficulty: "hard", learningOutcome: "Apply Bellman-Ford algorithm" },
  { id: "q14", text: "Tower of Hanoi with 3 disks requires how many moves?", options: ["5", "6", "7", "8"], correctIndex: 2, topic: "Recursion", subtopic: "Problems", difficulty: "medium", learningOutcome: "Solve recursive problems" },
  { id: "q15", text: "A tree with N nodes has how many edges?", options: ["N", "N-1", "N+1", "2N"], correctIndex: 1, topic: "Trees", subtopic: "Properties", difficulty: "easy", learningOutcome: "Apply tree edge property" },
  { id: "q16", text: "In-degree of a node in a directed graph is?", options: ["Outgoing edges", "Incoming edges", "Total edges", "Neighbor count"], correctIndex: 1, topic: "Graphs", subtopic: "Properties", difficulty: "easy", learningOutcome: "Understand graph terminology" },
  { id: "q17", text: "Which algorithm is used for topological sorting?", options: ["BFS only", "DFS only", "Both BFS and DFS", "Neither"], correctIndex: 2, topic: "Graphs", subtopic: "Topological Sort", difficulty: "hard", learningOutcome: "Apply topological sorting" },
  { id: "q18", text: "What is tail recursion?", options: ["Recursion that never ends", "Last operation is recursive call", "First call is recursive", "No base case"], correctIndex: 1, topic: "Recursion", subtopic: "Optimization", difficulty: "hard", learningOutcome: "Understand tail recursion optimization" },
  { id: "q19", text: "A complete binary tree of height h has maximum how many nodes?", options: ["2^h", "2^h - 1", "2^(h+1) - 1", "h^2"], correctIndex: 2, topic: "Trees", subtopic: "Properties", difficulty: "medium", learningOutcome: "Calculate max nodes in complete tree" },
  { id: "q20", text: "Kruskal's algorithm uses which data structure?", options: ["Stack", "Queue", "Union-Find", "Heap only"], correctIndex: 2, topic: "Graphs", subtopic: "Minimum Spanning Tree", difficulty: "hard", learningOutcome: "Apply Kruskal's MST algorithm" },
];

// ─── 20 Assessments ──────────────────────────────────────────

export const assessments: Assessment[] = [
  { id: "a1", title: "Trees and Graphs Quiz", classId: "c1", subject: "Computer Science", questionCount: 20, duration: 30, questions: treesAndGraphsQuestions, status: "completed", createdAt: "2025-05-10", attemptCount: 58 },
  { id: "a2", title: "Recursion Fundamentals", classId: "c1", subject: "Computer Science", questionCount: 15, duration: 25, questions: treesAndGraphsQuestions.slice(0,15), status: "completed", createdAt: "2025-04-22", attemptCount: 60 },
  { id: "a3", title: "Arrays & Linked Lists", classId: "c1", subject: "Computer Science", questionCount: 20, duration: 30, questions: treesAndGraphsQuestions, status: "completed", createdAt: "2025-03-15", attemptCount: 59 },
  { id: "a4", title: "Sorting Algorithms", classId: "c1", subject: "Computer Science", questionCount: 20, duration: 35, questions: treesAndGraphsQuestions, status: "active", createdAt: "2025-05-28", attemptCount: 42 },
  { id: "a5", title: "Dynamic Programming Intro", classId: "c2", subject: "Computer Science", questionCount: 20, duration: 40, questions: treesAndGraphsQuestions, status: "active", createdAt: "2025-05-25", attemptCount: 38 },
  { id: "a6", title: "Graph Traversal Mastery", classId: "c2", subject: "Computer Science", questionCount: 20, duration: 30, questions: treesAndGraphsQuestions, status: "completed", createdAt: "2025-04-30", attemptCount: 44 },
  { id: "a7", title: "Stack & Queue Operations", classId: "c1", subject: "Computer Science", questionCount: 15, duration: 20, questions: treesAndGraphsQuestions.slice(0,15), status: "completed", createdAt: "2025-02-20", attemptCount: 60 },
  { id: "a8", title: "Binary Search Trees", classId: "c2", subject: "Computer Science", questionCount: 20, duration: 30, questions: treesAndGraphsQuestions, status: "draft", createdAt: "2025-06-01", attemptCount: 0 },
  { id: "a9", title: "Hashing Techniques", classId: "c3", subject: "Computer Science", questionCount: 20, duration: 25, questions: treesAndGraphsQuestions, status: "active", createdAt: "2025-05-20", attemptCount: 35 },
  { id: "a10", title: "Greedy Algorithms", classId: "c2", subject: "Computer Science", questionCount: 20, duration: 35, questions: treesAndGraphsQuestions, status: "completed", createdAt: "2025-04-10", attemptCount: 43 },
  { id: "a11", title: "Calculus Mid-Term", classId: "c4", subject: "Mathematics", questionCount: 20, duration: 45, questions: treesAndGraphsQuestions, status: "completed", createdAt: "2025-04-05", attemptCount: 54 },
  { id: "a12", title: "Differentiation Quiz", classId: "c4", subject: "Mathematics", questionCount: 15, duration: 25, questions: treesAndGraphsQuestions.slice(0,15), status: "active", createdAt: "2025-05-18", attemptCount: 50 },
  { id: "a13", title: "Integration Techniques", classId: "c4", subject: "Mathematics", questionCount: 20, duration: 40, questions: treesAndGraphsQuestions, status: "draft", createdAt: "2025-06-02", attemptCount: 0 },
  { id: "a14", title: "Statistics Fundamentals", classId: "c5", subject: "Mathematics", questionCount: 20, duration: 30, questions: treesAndGraphsQuestions, status: "completed", createdAt: "2025-03-28", attemptCount: 47 },
  { id: "a15", title: "Probability Theory", classId: "c5", subject: "Mathematics", questionCount: 20, duration: 35, questions: treesAndGraphsQuestions, status: "active", createdAt: "2025-05-15", attemptCount: 40 },
  { id: "a16", title: "Linear Algebra Basics", classId: "c5", subject: "Mathematics", questionCount: 15, duration: 25, questions: treesAndGraphsQuestions.slice(0,15), status: "completed", createdAt: "2025-04-18", attemptCount: 46 },
  { id: "a17", title: "HTML & CSS Fundamentals", classId: "c3", subject: "Computer Science", questionCount: 20, duration: 30, questions: treesAndGraphsQuestions, status: "completed", createdAt: "2025-05-05", attemptCount: 37 },
  { id: "a18", title: "JavaScript Basics", classId: "c3", subject: "Computer Science", questionCount: 20, duration: 30, questions: treesAndGraphsQuestions, status: "completed", createdAt: "2025-04-25", attemptCount: 36 },
  { id: "a19", title: "React Fundamentals", classId: "c3", subject: "Computer Science", questionCount: 15, duration: 25, questions: treesAndGraphsQuestions.slice(0,15), status: "active", createdAt: "2025-05-30", attemptCount: 20 },
  { id: "a20", title: "Database Design Quiz", classId: "c2", subject: "Computer Science", questionCount: 20, duration: 30, questions: treesAndGraphsQuestions, status: "draft", createdAt: "2025-06-02", attemptCount: 0 },
];

// ─── Generate 500+ Attempts ───────────────────────────────────

function generateAttempt(studentId: string, assessmentId: string, student: Student, assessment: Assessment): Attempt {
  const answers: AttemptAnswer[] = assessment.questions.map((q) => {
    const topicMastery = student.topicMastery[q.topic] ?? 70;
    const correctProbability = topicMastery / 100;
    const isCorrect = Math.random() < correctProbability;
    const selected = isCorrect ? q.correctIndex : (q.correctIndex + 1 + Math.floor(Math.random() * 3)) % 4;
    const confidence: AttemptAnswer["confidence"] =
      topicMastery > 80 ? "very-confident"
      : topicMastery > 65 ? "confident"
      : topicMastery > 45 ? "unsure"
      : "guessing";
    return {
      questionId: q.id,
      selectedIndex: selected,
      timeTaken: Math.floor(20 + Math.random() * 100),
      confidence,
      isCorrect,
    };
  });

  const topicCorrect: Record<string, number[]> = {};
  const topicTotal: Record<string, number[]> = {};
  assessment.questions.forEach((q, idx) => {
    if (!topicCorrect[q.topic]) topicCorrect[q.topic] = [];
    if (!topicTotal[q.topic]) topicTotal[q.topic] = [];
    topicCorrect[q.topic].push(answers[idx].isCorrect ? 1 : 0);
    topicTotal[q.topic].push(1);
  });
  const topicScores: Record<string, number> = {};
  for (const t in topicCorrect) {
    const correct = topicCorrect[t].reduce((a, b) => a + b, 0);
    topicScores[t] = Math.round((correct / topicTotal[t].length) * 100);
  }

  const totalScore = Math.round(
    answers.filter((a) => a.isCorrect).length / answers.length * 100
  );

  return {
    id: `att-${studentId}-${assessmentId}`,
    studentId,
    assessmentId,
    answers,
    submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(),
    totalScore,
    topicScores,
  };
}

// Generate attempts for class c1 students × completed assessments
const c1Students = students.filter((s) => s.classId === "c1").slice(0, 25);
const completedAssessments = assessments.filter((a) => a.classId === "c1" && a.status === "completed");

export const attempts: Attempt[] = [];
for (const student of c1Students) {
  for (const assessment of completedAssessments) {
    attempts.push(generateAttempt(student.id, assessment.id, student, assessment));
  }
}
// Add additional attempts for other classes
for (const student of students.filter((s) => s.classId === "c2").slice(0, 20)) {
  for (const assessment of assessments.filter((a) => a.classId === "c2" && a.status === "completed")) {
    attempts.push(generateAttempt(student.id, assessment.id, student, assessment));
  }
}

// ─── AI Intervention Suggestions ─────────────────────────────

export type Intervention = {
  id: string;
  studentId: string;
  studentName: string;
  weakTopics: string[];
  rootCause: string;
  suggestions: { action: string; detail: string; impact: string }[];
  status: "pending" | "approved" | "dismissed";
  priority: "high" | "medium" | "low";
};

export const interventions: Intervention[] = students
  .filter((s) => s.risk !== "low" && s.weakTopics.length > 0)
  .slice(0, 15)
  .map((s, i) => ({
    id: `int-${i + 1}`,
    studentId: s.id,
    studentName: s.name,
    weakTopics: s.weakTopics,
    rootCause: s.rootCause,
    suggestions: [
      { action: `Assign ${s.rootCause} Module`, detail: `10 practice problems with increasing difficulty`, impact: "+12% mastery" },
      { action: "Schedule Revision Session", detail: `30-min 1-on-1 session focusing on ${s.weakTopics[0] ?? "weak topics"}`, impact: "+8% engagement" },
      { action: "Provide Practice Set", detail: `Curated 15-problem set from ${s.rootCause} to ${s.weakTopics[0] ?? "next topic"}`, impact: "+15% score" },
    ],
    status: i % 3 === 0 ? "approved" : "pending",
    priority: s.risk === "high" ? "high" : "medium",
  }));

// ─── Digital Twin Data (60-seat classroom) ───────────────────

export type SeatStatus = {
  seatId: string;
  studentId: string | null;
  studentName: string;
  mastery: number;
  status: "mastering" | "needs-revision" | "struggling" | "empty";
  weakTopic: string;
};

export function getDigitalTwinData(classId: string = "c1", topic?: string): SeatStatus[] {
  const classStudents = students.filter((s) => s.classId === classId).slice(0, 60);
  const seats: SeatStatus[] = [];
  for (let i = 0; i < 60; i++) {
    const student = classStudents[i];
    if (!student) {
      seats.push({ seatId: `seat-${i}`, studentId: null, studentName: "", mastery: 0, status: "empty", weakTopic: "" });
      continue;
    }
    const mastery = topic ? (student.topicMastery[topic] ?? student.performance) : student.performance;
    const status: SeatStatus["status"] = mastery >= 75 ? "mastering" : mastery >= 50 ? "needs-revision" : "struggling";
    seats.push({ seatId: `seat-${i}`, studentId: student.id, studentName: student.name, mastery, status, weakTopic: student.weakTopics[0] ?? "" });
  }
  return seats;
}

// ─── Admin / Institution Stats ────────────────────────────────

export const institutionStats = {
  name: "Lincoln International School",
  totalStudents: 1240,
  totalTeachers: 68,
  totalClasses: 94,
  avgScore: 72,
  atRiskStudents: 87,
  activeAssessments: 24,
};

export const departmentStats = [
  { dept: "Technology", subjects: 3, avgScore: 72, atRisk: 22, students: 143 },
  { dept: "Science", subjects: 3, avgScore: 68, atRisk: 31, students: 380 },
  { dept: "Humanities", subjects: 2, avgScore: 76, atRisk: 18, students: 240 },
  { dept: "Commerce", subjects: 2, avgScore: 70, atRisk: 16, students: 200 },
  { dept: "Arts", subjects: 2, avgScore: 82, atRisk: 6, students: 160 },
  { dept: "Sports Science", subjects: 1, avgScore: 79, atRisk: 4, students: 117 },
];

export const subjectAnalytics = [
  { subject: "Computer Science", avgScore: 72, weakTopic: "Recursion", atRisk: 12, improvement: 8 },
  { subject: "Mathematics", avgScore: 65, weakTopic: "Integration", atRisk: 18, improvement: 5 },
  { subject: "Physics", avgScore: 68, weakTopic: "Electromagnetism", atRisk: 15, improvement: 7 },
  { subject: "Chemistry", avgScore: 71, weakTopic: "Organic Chemistry", atRisk: 11, improvement: 9 },
  { subject: "English", avgScore: 78, weakTopic: "Essay Writing", atRisk: 8, improvement: 12 },
  { subject: "Biology", avgScore: 74, weakTopic: "Genetics", atRisk: 9, improvement: 6 },
  { subject: "Economics", avgScore: 69, weakTopic: "Macroeconomics", atRisk: 14, improvement: 4 },
  { subject: "History", avgScore: 75, weakTopic: "Modern History", atRisk: 7, improvement: 10 },
  { subject: "Geography", avgScore: 77, weakTopic: "Climatology", atRisk: 6, improvement: 11 },
  { subject: "Art", avgScore: 88, weakTopic: "Art History", atRisk: 3, improvement: 15 },
];

// ─── Continuous Learning Loop ─────────────────────────────────

export const learningLoopSteps = [
  { id: 1, label: "Assessment", icon: "📝", desc: "Teacher creates tagged quiz" },
  { id: 2, label: "Analysis", icon: "🧠", desc: "AI processes all responses" },
  { id: 3, label: "Gap Detection", icon: "🔍", desc: "Weak topics identified per student" },
  { id: 4, label: "Root Cause", icon: "🌳", desc: "Prerequisite failure traced" },
  { id: 5, label: "Recommendation", icon: "💡", desc: "Personalised actions generated" },
  { id: 6, label: "Intervention", icon: "🎯", desc: "Teacher approves and assigns" },
  { id: 7, label: "Practice", icon: "📚", desc: "Student follows learning path" },
  { id: 8, label: "Reassessment", icon: "🔄", desc: "Mini quiz on weak topics" },
  { id: 9, label: "Improvement", icon: "📈", desc: "Mastery score updated" },
];

// ─── Keep legacy exports for existing pages ───────────────────

export const stats = {
  totalStudents: students.length,
  activeStudents: students.filter((s) => s.attendance > 75).length,
  atRiskStudents: students.filter((s) => s.risk === "high").length,
  avgPerformance: Math.round(students.reduce((a, b) => a + b.performance, 0) / students.length),
  learningGapAlerts: interventions.filter((i) => i.status === "pending").length,
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
  { topic: "Arrays", mastered: 92, struggling: 8 },
  { topic: "Linked Lists", mastered: 82, struggling: 18 },
  { topic: "Stacks", mastered: 85, struggling: 15 },
  { topic: "Queues", mastered: 79, struggling: 21 },
  { topic: "Recursion", mastered: 48, struggling: 52 },
  { topic: "Trees", mastered: 42, struggling: 58 },
  { topic: "Graphs", mastered: 35, struggling: 65 },
  { topic: "Dynamic Programming", mastered: 38, struggling: 62 },
];

export const learningGaps = [
  { topic: "Arrays", count: 5, intensity: 0.1 },
  { topic: "Linked Lists", count: 12, intensity: 0.3 },
  { topic: "Stacks", count: 8, intensity: 0.2 },
  { topic: "Queues", count: 11, intensity: 0.28 },
  { topic: "Recursion", count: 32, intensity: 0.65 },
  { topic: "Trees", count: 38, intensity: 0.78 },
  { topic: "Graphs", count: 41, intensity: 0.85 },
  { topic: "Dynamic Programming", count: 35, intensity: 0.88 },
  { topic: "Sorting", count: 9, intensity: 0.22 },
  { topic: "Hashing", count: 14, intensity: 0.35 },
  { topic: "Greedy", count: 18, intensity: 0.45 },
  { topic: "Bit Magic", count: 7, intensity: 0.18 },
];

export const aiInsights = [
  { id: 1, title: "38 students struggle with Graph Traversal", root: "Recursion fundamentals", confidence: 92, severity: "high" as const },
  { id: 2, title: "Performance declined 12% this week in Class 10-B", root: "Missed prerequisite topic", confidence: 87, severity: "medium" as const },
  { id: 3, title: "Tree Traversal mastery up 18% after intervention", root: "Recursion module assigned", confidence: 95, severity: "low" as const },
];

export const recentAlerts = [
  { id: 1, type: "risk", title: "Aanya Sharma flagged at risk", time: "2m ago", priority: "high" as const },
  { id: 2, type: "gap", title: "New learning gap: Dynamic Programming", time: "15m ago", priority: "medium" as const },
  { id: 3, type: "rec", title: "AI recommendation generated for Class 9-A", time: "1h ago", priority: "low" as const },
  { id: 4, type: "risk", title: "Engagement dip detected in Period 4", time: "2h ago", priority: "medium" as const },
];

export const studentMastery = [
  { topic: "Arrays", mastery: 92 },
  { topic: "Linked Lists", mastery: 80 },
  { topic: "Stacks", mastery: 75 },
  { topic: "Trees", mastery: 45 },
  { topic: "Graphs", mastery: 38 },
  { topic: "Dynamic Programming", mastery: 30 },
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
  { id: 2, type: "gap", title: "New learning gap detected", body: "38 students struggling with Graphs", time: "15m ago", read: false, priority: "medium" as const },
  { id: 3, type: "rec", title: "Recommendation generated", body: "Personalized practice set for Class 11-A", time: "1h ago", read: true, priority: "low" as const },
  { id: 4, type: "done", title: "Assignment completed", body: "Recursion practice — 28/30 students", time: "3h ago", read: true, priority: "low" as const },
];

export const achievements = [
  { id: 1, title: "Tree Master", desc: "Completed all Tree modules", icon: "🌳" },
  { id: 2, title: "7-Day Streak", desc: "Practiced 7 days in a row", icon: "🔥" },
  { id: 3, title: "Recursion Hero", desc: "Solved 25 recursion problems", icon: "🧠" },
  { id: 4, title: "Top 10%", desc: "Ranked in top performers", icon: "🏆" },
];
