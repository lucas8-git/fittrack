import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import TopBar from "@/components/layout/TopBar";
import HistoryList from "@/components/workout/HistoryList";

export const metadata = { title: "FitTrack — Historique" };

export default async function HistoryPage() {
  const session = await auth();

  const workouts = await prisma.workout.findMany({
    where:   { userId: session!.user!.id!, status: "completed" },
    orderBy: { startedAt: "desc" },
    take:    20,
    include: {
      exercises: {
        include: {
          exercise: { select: { name: true, muscleGroup: true } },
          sets:     { where: { isCompleted: true } },
        },
      },
    },
  });

  const enriched = workouts.map((w) => ({
    ...w,
    totalVolume: w.exercises.reduce(
      (acc, ex) => acc + ex.sets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0),
      0
    ),
    exerciseCount: w.exercises.length,
    setCount: w.exercises.reduce((acc, ex) => acc + ex.sets.length, 0),
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar title="Historique" subtitle={`${workouts.length} séances`} />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <HistoryList initialWorkouts={JSON.parse(JSON.stringify(enriched))} />
      </Suspense>
    </div>
  );
}
