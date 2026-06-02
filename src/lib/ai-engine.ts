// ============================================================
// InsightEDU — Mock AI Engine
// Simulates AI analysis, root-cause detection, feedback, and predictions
// ============================================================

import type { Student, Attempt, Question, DependencyNode } from "./mock-data";
import { csDependencyTree, csChain } from "./mock-data";

// ─── Types ───────────────────────────────────────────────────

export type TopicMastery = {
  topic: string;
  mastery: number; // 0–100
  correct: number;
  total: number;
  avgTime: number; // seconds
  avgConfidence: number; // 0–4
};

export type RootCauseResult = {
  weakTopics: string[];
  rootCause: string;
  chain: string[];
  confidence: number;
};

export type FeedbackResult = {
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: { action: string; detail: string; estimatedTime: string }[];
  estimatedImprovementTime: string;
};

export type LearningPathStep = {
  topic: string;
  status: "completed" | "current" | "upcoming";
  estimatedTime: string;
  resources: string[];
};

export type RiskPrediction = {
  level: "low" | "medium" | "high";
  score: number; // 0–100
  factors: { factor: string; impact: "positive" | "negative"; weight: number }[];
  forecast: number[]; // 4-week score projection
};

// ─── Confidence score helpers ─────────────────────────────────

const confidenceScore: Record<string, number> = {
  "very-confident": 4,
  confident: 3,
  unsure: 2,
  guessing: 1,
};

// ─── analyzeAttempt ───────────────────────────────────────────

export function analyzeAttempt(attempt: Attempt, questions: Question[]): TopicMastery[] {
  const topicMap: Record<string, { correct: number; total: number; time: number; conf: number }> = {};

  for (const answer of attempt.answers) {
    const q = questions.find((q) => q.id === answer.questionId);
    if (!q) continue;
    if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0, time: 0, conf: 0 };
    topicMap[q.topic].total++;
    topicMap[q.topic].time += answer.timeTaken;
    topicMap[q.topic].conf += confidenceScore[answer.confidence] ?? 2;
    if (answer.isCorrect) topicMap[q.topic].correct++;
  }

  return Object.entries(topicMap).map(([topic, data]) => ({
    topic,
    mastery: Math.round((data.correct / data.total) * 100),
    correct: data.correct,
    total: data.total,
    avgTime: Math.round(data.time / data.total),
    avgConfidence: Math.round((data.conf / data.total) * 10) / 10,
  }));
}

// ─── detectRootCause ─────────────────────────────────────────

export function detectRootCause(
  topicMasteryList: TopicMastery[],
  threshold = 60,
  tree: DependencyNode[] = csDependencyTree
): RootCauseResult {
  const weakTopics = topicMasteryList
    .filter((tm) => tm.mastery < threshold)
    .map((tm) => tm.topic);

  if (weakTopics.length === 0) {
    return { weakTopics: [], rootCause: "None", chain: [], confidence: 99 };
  }

  // Find deepest ancestor that is weak (root cause = earliest weak prerequisite)
  let rootCause = weakTopics[0];
  let minLevel = Infinity;
  for (const topic of weakTopics) {
    const node = tree.find((n) => n.topic === topic);
    if (node && node.level < minLevel) {
      minLevel = node.level;
      rootCause = topic;
    }
  }

  // Build chain from root cause to most advanced weak topic
  const chain = buildChain(rootCause, weakTopics[weakTopics.length - 1], tree);
  const confidence = Math.min(95, 70 + weakTopics.length * 5);

  return { weakTopics, rootCause, chain, confidence };
}

function buildChain(start: string, end: string, tree: DependencyNode[]): string[] {
  // Use csChain as a template for the display path
  const startIdx = csChain.indexOf(start);
  const endIdx = csChain.indexOf(end);
  if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
    return csChain.slice(startIdx, endIdx + 1);
  }
  // Fallback: just return relevant part
  const chain: string[] = [start];
  let current = start;
  let attempts = 0;
  while (current !== end && attempts < 10) {
    const dependents = tree.filter((n) => n.requires.includes(current));
    if (dependents.length === 0) break;
    current = dependents[0].topic;
    chain.push(current);
    attempts++;
  }
  return chain;
}

// ─── generateFeedback ────────────────────────────────────────

export function generateFeedback(
  studentName: string,
  topicMasteryList: TopicMastery[],
  rootCauseResult: RootCauseResult
): FeedbackResult {
  const firstName = studentName.split(" ")[0];
  const strong = topicMasteryList.filter((t) => t.mastery >= 75).map((t) => t.topic);
  const weak = topicMasteryList.filter((t) => t.mastery < 60).map((t) => t.topic);

  const summary =
    weak.length === 0
      ? `Excellent work, ${firstName}! You have demonstrated strong mastery across all assessed topics.`
      : `${firstName}, you have a solid foundation in ${strong.slice(0, 2).join(" and ")}. However, you are currently struggling with ${weak.slice(0, 2).join(" and ")}, which can be traced back to a gap in ${rootCauseResult.rootCause} fundamentals. With focused practice, you can close this gap in approximately 2–3 hours.`;

  const recommendations = weak.length > 0
    ? [
        { action: `Watch ${rootCauseResult.rootCause} Video`, detail: `30-min curated explainer focusing on core ${rootCauseResult.rootCause} concepts`, estimatedTime: "30 min" },
        { action: "Complete Practice Set", detail: `15 problems ramping from ${rootCauseResult.rootCause} to ${weak[0]}`, estimatedTime: "45 min" },
        { action: "Retake Mini-Assessment", detail: `10-question targeted quiz on ${rootCauseResult.rootCause} and ${weak[0]}`, estimatedTime: "20 min" },
      ]
    : [
        { action: "Explore Advanced Topics", detail: "You're ready for the next module!", estimatedTime: "60 min" },
      ];

  return {
    summary,
    strengths: strong,
    improvements: weak,
    recommendations,
    estimatedImprovementTime: weak.length === 0 ? "0 hours" : `${Math.max(1, weak.length) * 2} hours`,
  };
}

// ─── generateLearningPath ────────────────────────────────────

export function generateLearningPath(
  student: Student,
  _tree: DependencyNode[] = csDependencyTree
): LearningPathStep[] {
  const path = student.learningPath;
  if (path.length === 0) {
    return [{ topic: "Advanced Topics", status: "upcoming", estimatedTime: "60 min", resources: ["Video lecture", "Problem set"] }];
  }

  return path.map((topic, i) => ({
    topic,
    status: i === 0 ? "current" : "upcoming",
    estimatedTime: `${30 + i * 15} min`,
    resources: ["Video lecture", "Practice problems", i > 0 ? "Mini-quiz" : "Concept notes"],
  }));
}

// ─── predictRisk ─────────────────────────────────────────────

export function predictRisk(student: Student): RiskPrediction {
  const perfScore = student.performance;
  const attendScore = student.attendance;
  const gapPenalty = student.gaps * 5;
  const overallScore = Math.max(0, Math.min(100, (perfScore + attendScore) / 2 - gapPenalty));

  const level: RiskPrediction["level"] =
    overallScore < 45 ? "high" : overallScore < 65 ? "medium" : "low";

  const factors: RiskPrediction["factors"] = [
    { factor: "Assessment performance", impact: perfScore >= 65 ? "positive" : "negative", weight: perfScore },
    { factor: "Attendance rate", impact: attendScore >= 75 ? "positive" : "negative", weight: attendScore },
    { factor: "Learning gaps", impact: student.gaps === 0 ? "positive" : "negative", weight: 100 - gapPenalty },
    { factor: "Engagement trend", impact: student.risk !== "high" ? "positive" : "negative", weight: level === "low" ? 80 : 40 },
  ];

  const forecast = Array.from({ length: 4 }, (_, i) => {
    const base = perfScore;
    const trend = level === "low" ? 2 : level === "medium" ? 0 : -2;
    return Math.max(20, Math.min(100, base + trend * (i + 1) + (Math.random() * 4 - 2)));
  });

  return { level, score: overallScore, factors, forecast };
}

// ─── Class-level AI Summary ───────────────────────────────────

export type ClassAISummary = {
  avgMastery: Record<string, number>;
  classRootCause: string;
  atRiskCount: number;
  topInsight: string;
  interventionNeeded: boolean;
};

export function generateClassSummary(studentList: Student[]): ClassAISummary {
  const topicTotals: Record<string, number[]> = {};
  for (const s of studentList) {
    for (const [topic, mastery] of Object.entries(s.topicMastery)) {
      if (!topicTotals[topic]) topicTotals[topic] = [];
      topicTotals[topic].push(mastery);
    }
  }
  const avgMastery: Record<string, number> = {};
  for (const [topic, values] of Object.entries(topicTotals)) {
    avgMastery[topic] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }

  const weakestTopic = Object.entries(avgMastery).sort((a, b) => a[1] - b[1])[0]?.[0] ?? "Recursion";
  const atRiskCount = studentList.filter((s) => s.risk !== "low").length;
  const rootNode = csDependencyTree.find((n) =>
    csDependencyTree.some((dep) => dep.requires.includes(n.topic) && dep.topic === weakestTopic)
  );

  return {
    avgMastery,
    classRootCause: rootNode?.topic ?? weakestTopic,
    atRiskCount,
    topInsight: `${atRiskCount} students are struggling with ${weakestTopic}. Root cause traced to ${rootNode?.topic ?? "prerequisite gaps"}.`,
    interventionNeeded: atRiskCount > studentList.length * 0.2,
  };
}
