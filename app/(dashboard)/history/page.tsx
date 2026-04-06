'use client';

import { auth } from '@/auth';
import { HistoryList } from '@/components';
import { prisma } from '@/lib/db';
import { Suspense } from 'react';

export const metadata = { title: 'History | FitTrack' };

async function HistoryContent() {
  const session = await auth();
  const userId = session!.user!.id!;

  const workouts = await prisma.workout.findMany({
    where: { userId, status: 'completed' },
    orderBy: { startedAt: 'desc' },
    include: {
      exercises: {
        include: {
          exercise: { select: { name: true, muscleGroup: true } },
          sets: { where: { isCompleted: true } },
        },
      },
    },
  });

  return <HistoryList workouts={workouts} />;
}

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary-500 pt-14 pb-6 px-5">
        <h1 className="text-2xl font-extrabold text-white">Historique</h1>
        <p className="text-primary-200 text-sm mt-1">Toutes tes séances passées</p>
      </div>
      <div className="px-4 py-6 pb-20">
        <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
          <HistoryContent />
        </Suspense>
      </div>
    </div>
  );
}
