import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDigitalTwinData, type SeatStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/teacher-digital-twin")({
  head: () => ({ meta: [{ title: "Classroom Digital Twin — InsightEDU" }] }),
  component: DigitalTwinPage,
});

const topics = ["All Topics", "Arrays", "Linked Lists", "Recursion", "Trees", "Graphs", "Dynamic Programming", "Sorting"];

const statusConfig = {
  mastering: { label: "Mastering", color: "bg-success", textColor: "text-success", bg: "bg-success/15 hover:bg-success/25 border-success/30", ring: "ring-success" },
  "needs-revision": { label: "Needs Revision", color: "bg-warning", textColor: "text-warning", bg: "bg-warning/15 hover:bg-warning/25 border-warning/30", ring: "ring-warning" },
  struggling: { label: "Struggling", color: "bg-destructive", textColor: "text-destructive", bg: "bg-destructive/15 hover:bg-destructive/25 border-destructive/30", ring: "ring-destructive" },
  empty: { label: "Empty", color: "bg-muted", textColor: "text-muted-foreground", bg: "bg-muted/20 border-border/30", ring: "" },
};

function SeatCell({ seat, isSelected, onClick }: { seat: SeatStatus; isSelected: boolean; onClick: () => void }) {
  const cfg = statusConfig[seat.status];
  if (seat.status === "empty") {
    return <div className="h-10 w-10 rounded-lg border border-dashed border-border/30 bg-muted/10" />;
  }
  return (
    <motion.button
      whileHover={{ scale: 1.15, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative h-10 w-10 rounded-xl border-2 transition-all cursor-pointer",
        cfg.bg,
        isSelected && `ring-2 ${cfg.ring} ring-offset-2 ring-offset-background`
      )}
      title={seat.studentName}
    >
      {/* Pulse for struggling */}
      {seat.status === "struggling" && (
        <span className="absolute inset-0 rounded-xl animate-ping bg-destructive/30 opacity-75" />
      )}
      <div className="relative flex h-full w-full items-center justify-center">
        <div className={cn("h-2.5 w-2.5 rounded-full", cfg.color)} />
      </div>
    </motion.button>
  );
}

function DigitalTwinPage() {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [seats, setSeats] = useState<SeatStatus[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatStatus | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  const refreshData = () => {
    const topic = selectedTopic === "All Topics" ? undefined : selectedTopic;
    setSeats(getDigitalTwinData("c1", topic));
    setLastRefresh(new Date());
  };

  useEffect(() => {
    refreshData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic]);

  // Live update simulation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, selectedTopic]);

  const mastering = seats.filter((s) => s.status === "mastering").length;
  const needsRevision = seats.filter((s) => s.status === "needs-revision").length;
  const struggling = seats.filter((s) => s.status === "struggling").length;
  const total = seats.filter((s) => s.status !== "empty").length;

  // 6 rows × 10 columns = 60 seats
  const rows = Array.from({ length: 6 }, (_, row) =>
    seats.slice(row * 10, row * 10 + 10)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Classroom Digital Twin</h1>
            <Badge className={cn("gap-1", isLive ? "bg-success/15 text-success ring-1 ring-success/30" : "bg-muted")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", isLive ? "bg-success animate-pulse" : "bg-muted-foreground")} />
              {isLive ? "Live" : "Paused"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time mastery view — Data Structures, Grade 11 · Updated {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)} className="gap-1.5">
            {isLive ? "Pause" : "Resume"} Live
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div><div className="font-display text-2xl font-bold">{total}</div><div className="text-xs text-muted-foreground">Present</div></div>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
              <div><div className="font-display text-2xl font-bold text-success">{mastering}</div><div className="text-xs text-muted-foreground">Mastering</div></div>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"><Sparkles className="h-5 w-5 text-warning" /></div>
              <div><div className="font-display text-2xl font-bold text-warning">{needsRevision}</div><div className="text-xs text-muted-foreground">Need Revision</div></div>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
              <div><div className="font-display text-2xl font-bold text-destructive">{struggling}</div><div className="text-xs text-muted-foreground">Struggling</div></div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button key={t} onClick={() => setSelectedTopic(t)}
            className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition",
              selectedTopic === t ? "border-primary bg-primary/10 text-primary shadow-glow" : "border-border hover:bg-accent"
            )}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Main Twin Grid */}
        <GlassCard title="Live Classroom Map" description="Each seat shows student mastery level in real-time">
          {/* Teacher desk */}
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-2xl border-2 border-primary/40 bg-primary/10 px-10 py-2 text-xs font-semibold text-primary">
              🏫 Teacher's Desk
            </div>
          </div>

          {/* Seat grid */}
          <div className="space-y-3">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center gap-2 justify-center">
                <div className="text-[10px] text-muted-foreground w-5 text-right shrink-0">R{rowIdx + 1}</div>
                <div className="flex gap-2 flex-wrap">
                  {/* Aisle after seat 5 */}
                  {row.slice(0, 5).map((seat) => (
                    <SeatCell key={seat.seatId} seat={seat} isSelected={selectedSeat?.seatId === seat.seatId} onClick={() => setSelectedSeat(selectedSeat?.seatId === seat.seatId ? null : seat)} />
                  ))}
                  <div className="w-4" />
                  {row.slice(5).map((seat) => (
                    <SeatCell key={seat.seatId} seat={seat} isSelected={selectedSeat?.seatId === seat.seatId} onClick={() => setSelectedSeat(selectedSeat?.seatId === seat.seatId ? null : seat)} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-border/50 pt-4">
            {(["mastering","needs-revision","struggling"] as const).map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-xs">
                <div className={cn("h-3 w-3 rounded-full", statusConfig[s].color)} />
                <span className="text-muted-foreground">{statusConfig[s].label}</span>
              </div>
            ))}
          </div>

          {/* Progress bar breakdown */}
          <div className="mt-4 space-y-1.5">
            <div className="flex text-xs text-muted-foreground justify-between">
              <span>Class distribution</span>
              <span>{total} students</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full gap-px">
              {total > 0 && (<>
                <motion.div animate={{ width: `${(mastering / total) * 100}%` }} className="bg-success h-full rounded-l-full" />
                <motion.div animate={{ width: `${(needsRevision / total) * 100}%` }} className="bg-warning h-full" />
                <motion.div animate={{ width: `${(struggling / total) * 100}%` }} className="bg-destructive h-full rounded-r-full" />
              </>)}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span className="text-success">{Math.round((mastering / total) * 100) || 0}% mastering</span>
              <span className="text-warning">{Math.round((needsRevision / total) * 100) || 0}% revision</span>
              <span className="text-destructive">{Math.round((struggling / total) * 100) || 0}% struggling</span>
            </div>
          </div>
        </GlassCard>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Selected student */}
          <AnimatePresence>
            {selectedSeat && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <GlassCard title="Student Detail">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                        {selectedSeat.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{selectedSeat.studentName}</div>
                        <Badge className={cn("text-[10px] mt-0.5", statusConfig[selectedSeat.status].bg, statusConfig[selectedSeat.status].textColor)}>
                          {statusConfig[selectedSeat.status].label}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Topic mastery</span>
                        <span className="font-semibold">{selectedSeat.mastery}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedSeat.mastery}%` }}
                          className={cn("h-full rounded-full", selectedSeat.status === "mastering" ? "bg-success" : selectedSeat.status === "needs-revision" ? "bg-warning" : "bg-destructive")}
                        />
                      </div>
                    </div>
                    {selectedSeat.weakTopic && (
                      <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs">
                        <div className="text-destructive font-medium">Weak area</div>
                        <div className="text-muted-foreground mt-0.5">{selectedSeat.weakTopic}</div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Struggling students list */}
          <GlassCard title="Needs Attention" description={`${struggling} students struggling`}>
            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
              {seats.filter((s) => s.status === "struggling").map((seat, i) => (
                <motion.button
                  key={seat.seatId}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedSeat(seat)}
                  className="w-full flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-left hover:bg-destructive/10 transition"
                >
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{seat.studentName}</div>
                    <div className="text-[10px] text-muted-foreground">{seat.mastery}% mastery{seat.weakTopic ? ` · ${seat.weakTopic}` : ""}</div>
                  </div>
                </motion.button>
              ))}
              {struggling === 0 && <div className="text-center text-xs text-muted-foreground py-4">🎉 No students struggling right now!</div>}
            </div>
          </GlassCard>

          {/* AI Suggestion */}
          {struggling > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlassCard className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <Sparkles className="h-4 w-4" /> AI Suggestion
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {struggling} students are struggling with {selectedTopic === "All Topics" ? "multiple topics" : selectedTopic}. Consider pausing and running a quick Recursion recap before proceeding.
                </p>
                <Button size="sm" className="mt-3 w-full gradient-primary text-primary-foreground text-xs">
                  Send Reminder to Class
                </Button>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
