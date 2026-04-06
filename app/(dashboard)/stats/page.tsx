'use client';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Suspense } from 'react';

export const metadata = { title: 'Stats | FitTrack' };

async function StatsContent() {
  const session = await auth();
  const userId = session!.user!.id!;

  // Get all PRs
  const prs = await prisma.workoutSet.findMany({
    where: {
      workoutExercise: {
        workout: { userId, status: 'completed' },
      },
      isCompleted: true,
      weight: { gt: 0 },
    },
    include: {
      workoutExercise: {
        include: {
          exercise: { select: { id: true, name: true, muscleGroup: true } },
        },
      },
    },
    orderBy: { weight: 'desc' },
  });

  // Group by exercise
  const groupedPRs = prs.reduce((acc, set) => {
    const exerciseId = set.workoutExercise.exercise.id;
    if (!acc[exerciseId]) {
      acc[exerciseId] = {
        exercise: set.workoutExercise.exercise,
        maxWeight: set.weight,
        totalReps: 0,
        sets: [],
      };
    }
    acc[exerciseId].sets.push(set);
    acc[exerciseId].totalReps += set.reps ?? 0;
    return acc;
  }, {} as Record<string, any>);

  const groupedArray = Object.values(groupedPRs)
    .sort((a, b) => b.maxWeight - a.maxWeight)
    .slice(0, 10);

  return (
    <div className="space-y-4">
      {groupedArray.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-sm font-bold text-foreground">Pas de records yet!</p>
          <p className="text-xs text-neutral-400 mt-1">Complete workouts to see your PRs</p>
        </div>
      ) : (
        groupedArray.map((item) => (
          <div key={item.exercise.id} className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">{item.exercise.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{item.exercise.muscleGroup}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-primary-500">{item.maxWeight} kg</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function StatsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary-500 pt-14 pb-6 px-5">
        <h1 className="text-2xl font-extrabold text-white">Mes Records</h1>
        <p className="text-primary-200 text-sm mt-1">Top 10 poids soulevés</p>
      </div>
      <div className="px-4 py-6 pb-20">
        <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
          <StatsContent />
        </Suspense>
      </div>
    </div>
  );
}
