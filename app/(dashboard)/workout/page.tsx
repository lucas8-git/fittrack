'use client';

import { Suspense } from 'react';
import { StartWorkout } from '@/components';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Start Workout | FitTrack' };

async function WorkoutContent() {
  const session = await auth();
  const userId = session!.user!.id!;

  const exercises = await prisma.exercise.findMany({
    orderBy: { muscleGroup: 'asc' },
  });

  return <StartWorkout exercises={exercises} />;
}

export default function WorkoutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary-500 pt-14 pb-6 px-5">
        <h1 className="text-2xl font-extrabold text-white">Démarrer une séance</h1>
        <p className="text-primary-200 text-sm mt-1">Choisis tes exercices</p>
      </div>
      <div className="px-4 py-6 pb-20">
        <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
          <WorkoutContent />
        </Suspense>
      </div>
    </div>
  );
}
