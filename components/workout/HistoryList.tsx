"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Dumbbell, Clock, Flame, TrendingUp } from "lucide-react";
import { formatDate, formatDuration, MUSCLE_LABELS } from "@/lib/utils";

interface WorkoutSummary {
  id:            string;
  name:          string | null;
  startedAt:     string;
  duration:      number | null;
  totalVolume:   number;
  exerciseCount: number;
  setCount:      number;
  exercises: {
    exercise: { name: string; muscleGroup: string };
    sets:     { weight: number | null; reps: number | null }[];
  }[];
}

function WorkoutCard({ workout }: { workout: WorkoutSummary }) {
  const [expanded, setExpanded] = useState(false);

  // Build muscle groups list
  const muscleGroups = [...new Set(workout.exercises.map((e) => e.exercise.muscleGroup))];

  const ACCENT: Record<string, string> = {
    chest:     "bg-primary-500",
    back:      "bg-success",
    legs:      "bg-warning",
    shoulders: "bg-primary-400",
    arms:      "bg-gold",
    core:      "bg-success",
    full_body: "bg-warning",
  };

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Card header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        {/* Color dot */}
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ACCENT[muscleGroups[0]] ?? "bg-primary-500"}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-foreground truncate">
              {workout.name ?? formatDate(workout.startedAt)}
            </p>
            <ChevronRight
              size={15}
              className={`shrink-0 text-neutral-300 transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          </div>

          {/* Date if name exists */}
          {workout.name && (
            <p className="text-xs text-neutral-400 mt-0.5">{formatDate(workout.startedAt)}</p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {workout.duration && (
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock size={11} />
                <span>{formatDuration(workout.duration)}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <Dumbbell size={11} />
              <span>{workout.exerciseCount} exercices · {workout.setCount} séries</span>
            </div>
            {workout.totalVolume > 0 && (
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <TrendingUp size={11} />
                <span>{Math.round(workout.totalVolume).toLocaleString("fr-FR")} kg</span>
              </div>
            )}
          </div>

          {/* Muscle chips */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {muscleGroups.slice(0, 3).map((mg) => (
              <span
                key={mg}
                className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-semibold rounded-full"
              >
                {MUSCLE_LABELS[mg] ?? mg}
              </span>
            ))}
            {muscleGroups.length > 3 && (
              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-semibold rounded-full">
                +{muscleGroups.length - 3}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-neutral-50 px-4 py-3 space-y-2.5">
          {workout.exercises.map((we, i) => {
            const completedSets = we.sets.filter((s) => s.weight || s.reps);
            const maxWeight = Math.max(...we.sets.map((s) => s.weight ?? 0));
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                <p className="text-xs font-semibold text-foreground flex-1">{we.exercise.name}</p>
                <p className="text-xs text-neutral-400">
                  {completedSets.length} × {maxWeight > 0 ? `${maxWeight} kg` : "BW"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HistoryList({
  initialWorkouts,
}: {
  initialWorkouts: WorkoutSummary[];
}) {
  const searchParams = useSearchParams();
  const justFinished = searchParams.get("finished") === "1";

  if (initialWorkouts.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {justFinished && (
          <div className="bg-success-light text-success text-sm font-semibold rounded-2xl px-4 py-3 mb-6 w-full">
            🎉 Séance enregistrée avec succès !
          </div>
        )}
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
          <Flame size={28} className="text-primary-500" />
        </div>
        <p className="text-base font-bold text-foreground">Pas encore de séances</p>
        <p className="text-sm text-neutral-400 mt-1">
          Lance ta première séance pour voir ton historique ici.
        </p>
      </div>
    );
  }

  // Group workouts by month
  const groups: Record<string, WorkoutSummary[]> = {};
  for (const w of initialWorkouts) {
    const key = new Date(w.startedAt).toLocaleDateString("fr-FR", {
      month: "long",
      year:  "numeric",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(w);
  }

  return (
    <div className="px-4 py-4 space-y-6">
      {justFinished && (
        <div className="bg-success-light text-success text-sm font-semibold rounded-2xl px-4 py-3 flex items-center gap-2">
          <span>🎉</span>
          <span>Séance enregistrée avec succès !</span>
        </div>
      )}

      {Object.entries(groups).map(([month, workouts]) => (
        <div key={month}>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
            {month}
          </p>
          <div className="space-y-2.5">
            {workouts.map((w) => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
