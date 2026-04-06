'use client';

import Link from 'next/link';
import { formatDate, formatDuration, MUSCLE_LABELS } from '@/lib/utils';
import { Dumbbell } from 'lucide-react';

interface WorkoutWithExercises {
  id: string;
  startedAt: Date;
  duration?: number;
  exercises: Array<{
    exercise: { name: string; muscleGroup: string };
    sets: Array<{ weight?: number; reps?: number }>;
  }>;
}

export function HistoryList({ workouts }: { workouts: WorkoutWithExercises[] }) {
  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card p-8 text-center">
        <p className="text-sm font-bold text-foreground">Pas d'historique</p>
        <p className="text-xs text-neutral-400 mt-1">Tes séances complétées apparaitront ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workouts.map((workout) => {
        const totalVol = workout.exercises.reduce(
          (a, e) => a + e.sets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0),
          0
        );
        const muscles = [...new Set(workout.exercises.map((e) => e.exercise.muscleGroup))];

        return (
          <Link
            key={workout.id}
            href={`/workout/history/${workout.id}`}
            className="bg-white rounded-lg shadow-card p-4 flex items-center gap-3 hover:shadow-lg hover:scale-[1.01] transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
              <Dumbbell size={18} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{formatDate(workout.startedAt)}</p>
              <p className="text-xs text-neutral-400 mt-0.5 truncate">
                {muscles.slice(0, 2).map((m) => MUSCLE_LABELS[m] ?? m).join(' • ')}
                {muscles.length > 2 && ` +${muscles.length - 2}`}
              </p>
            </div>
            <div className="text-right shrink-0">
              {workout.duration && (
                <p className="text-xs font-semibold text-neutral-600">{formatDuration(workout.duration)}</p>
              )}
              {totalVol > 0 && (
                <p className="text-[10px] text-neutral-400 mt-0.5">{Math.round(totalVol).toLocaleString('fr-FR')} kg</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
