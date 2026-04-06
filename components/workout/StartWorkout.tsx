'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Exercise } from '@prisma/client';
import { Plus, Play } from 'lucide-react';
import { MUSCLE_LABELS } from '@/lib/utils';

export function StartWorkout({ exercises }: { exercises: Exercise[] }) {
  const router = useRouter();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const grouped = exercises.reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) acc[ex.muscleGroup] = [];
    acc[ex.muscleGroup].push(ex);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const handleStartWorkout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to create workout');
      const workout = await res.json();

      for (const exerciseId of selectedExercises) {
        await fetch(`/api/workouts/${workout.id}/exercises`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exerciseId }),
        });
      }

      router.push(`/workout/active?id=${workout.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (id: string) => {
    setSelectedExercises((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(grouped).map(([group, groupExercises]) => (
          <div key={group}>
            <h3 className="font-semibold text-foreground mb-2 text-sm">
              {MUSCLE_LABELS[group] || group}
            </h3>
            <div className="space-y-2">
              {groupExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedExercises.includes(ex.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-medium text-foreground">{ex.name}</p>
                  {ex.notes && (
                    <p className="text-xs text-neutral-500 mt-1">{ex.notes}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleStartWorkout}
        disabled={selectedExercises.length === 0 || loading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Play size={18} />
        Commencer ({selectedExercises.length} exercices)
      </button>
    </div>
  );
}
