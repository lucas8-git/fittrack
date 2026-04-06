'use client';

import { Suspense } from 'react';
import { ExerciseLibrary } from '@/components';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Exercises | FitTrack' };

async function ExercisesContent() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { muscleGroup: 'asc' },
  });

  return <ExerciseLibrary exercises={exercises} />;
}

export default function ExercisesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary-500 pt-14 pb-6 px-5">
        <h1 className="text-2xl font-extrabold text-white">Exercices disponibles</h1>
        <p className="text-primary-200 text-sm mt-1">Consultez notre collection complète</p>
      </div>
      <div className="px-4 py-6">
        <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
          <ExercisesContent />
        </Suspense>
      </div>
    </div>
  );
}
