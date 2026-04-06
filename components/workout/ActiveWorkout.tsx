'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Check, X } from 'lucide-react';
import { useDashboardStore } from '@/lib/store';

export function ActiveWorkout({ workoutId }: { workoutId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<any>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await fetch(`/api/workouts/${workoutId}`);
        if (res.ok) {
          const data = await res.json();
          setWorkout(data);
        } else {
          setError('Workout not found');
        }
      } catch (err) {
        setError('Failed to load workout');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const addExercise = async (exerciseId: string) => {
    try {
      const res = await fetch(`/api/workouts/${workoutId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId }),
      });

      if (res.ok) {
        const newExercise = await res.json();
        setWorkout((prev: any) => ({
          ...prev,
          exercises: [...prev.exercises, newExercise],
        }));
      }
    } catch (err) {
      setError('Failed to add exercise');
    }
  };

  const addSet = async (exerciseId: string) => {
    try {
      const res = await fetch(
        `/api/workouts/${workoutId}/exercises/${exerciseId}/sets`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weight: weight || 0,
            reps: reps || 0,
            isCompleted: false,
          }),
        }
      );

      if (res.ok) {
        const newSet = await res.json();
        setWorkout((prev: any) => ({
          ...prev,
          exercises: prev.exercises.map((ex: any) =>
            ex.id === exerciseId
              ? { ...ex, sets: [...ex.sets, newSet] }
              : ex
          ),
        }));
        setWeight('');
        setReps('');
      }
    } catch (err) {
      setError('Failed to add set');
    }
  };

  const toggleSetComplete = async (setId: string, exerciseId: string, isCompleted: boolean) => {
    try {
      const res = await fetch(
        `/api/workouts/${workoutId}/exercises/${exerciseId}/sets`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setId, isCompleted: !isCompleted }),
        }
      );

      if (res.ok) {
        setWorkout((prev: any) => ({
          ...prev,
          exercises: prev.exercises.map((ex: any) =>
            ex.id === exerciseId
              ? {
                  ...ex,
                  sets: ex.sets.map((set: any) =>
                    set.id === setId ? { ...set, isCompleted: !isCompleted } : set
                  ),
                }
              : ex
          ),
        }));
      }
    } catch (err) {
      setError('Failed to update set');
    }
  };

  const completeWorkout = async () => {
    try {
      const duration = Math.floor((Date.now() - new Date(workout.startedAt).getTime()) / 1000);
      const res = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', duration }),
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Failed to complete workout');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error || 'Workout not found'}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary-500 pt-14 pb-6 px-5">
        <h1 className="text-2xl font-extrabold text-white">Séance en cours</h1>
      </div>

      <div className="px-4 py-6 pb-20 space-y-4">
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}

        <div className="space-y-4">
          {workout.exercises.map((exercise: any) => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-card p-4">
              <h3 className="font-bold text-foreground">{exercise.exercise.name}</h3>
              <div className="mt-3 space-y-2">
                {exercise.sets.map((set: any, idx: number) => (
                  <div key={set.id} className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
                    <button
                      onClick={() => toggleSetComplete(set.id, exercise.id, set.isCompleted)}
                      className={set.isCompleted ? 'text-green-600' : 'text-neutral-400'}
                    >
                      <Check size={20} />
                    </button>
                    <span className="text-sm flex-1">{set.weight} kg × {set.reps}</span>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={completeWorkout}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Terminer la séance
        </button>
      </div>
    </div>
  );
                                                                                   }
