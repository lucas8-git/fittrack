/**
 * GET /api/stats/prs
 * Returns the Personal Records (PRs) for every exercise the user has trained.
 * PR = max weight used on a completed set for that exercise.
 * Also computes 1RM estimate using the Epley formula.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { calc1RM } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Fetch all completed sets the user ever did, grouped by exercise
  const workoutExercises = await prisma.workoutExercise.findMany({
    where: {
      workout: { userId: session.user.id, status: "completed" },
    },
    include: {
      exercise: { select: { id: true, name: true, muscleGroup: true } },
      sets: {
        where:   { isCompleted: true, weight: { gt: 0 } },
        orderBy: { weight: "desc" },
      },
    },
  });

  // Group by exerciseId and find the best set
  const prMap = new Map<
    string,
    { exercise: { id: string; name: string; muscleGroup: string }; weight: number; reps: number; date: Date }
  >();

  for (const we of workoutExercises) {
    if (we.sets.length === 0) continue;
    const bestSet = we.sets[0]; // ordered by weight desc
    const current = prMap.get(we.exerciseId);

    // Update if this is a new PR
    if (!current || bestSet.weight! > current.weight) {
      const workout = await prisma.workout.findFirst({
        where: { exercises: { some: { id: we.id } } },
        select: { startedAt: true },
      });
      prMap.set(we.exerciseId, {
        exercise: we.exercise,
        weight:   bestSet.weight!,
        reps:     bestSet.reps ?? 1,
        date:     workout?.startedAt ?? new Date(),
      });
    }
  }

  // Convert to array with 1RM estimate
  const prs = Array.from(prMap.values())
    .map((pr) => ({
      exercise:    pr.exercise,
      weight:      pr.weight,
      reps:        pr.reps,
      estimated1RM: calc1RM(pr.weight, pr.reps),
      date:        pr.date,
    }))
    .sort((a, b) => b.weight - a.weight);

  return NextResponse.json(prs);
}
