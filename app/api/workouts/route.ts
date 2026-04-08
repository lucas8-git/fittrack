/**
 * GET  /api/workouts — List user's completed workouts (paginated)
 * POST /api/workouts — Start a new workout session
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit  = Math.min(Number(searchParams.get("limit") ?? 20), 50);
  const cursor = searchParams.get("cursor") ?? undefined;

  const workouts = await prisma.workout.findMany({
    where:   { userId: session.user.id, status: "completed" },
    orderBy: { startedAt: "desc" },
    take:    limit,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: {
      exercises: {
        include: {
          exercise: { select: { name: true, muscleGroup: true } },
          sets:     { where: { isCompleted: true } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  // Compute total volume per workout
  const enriched = workouts.map((w) => {
    const totalVolume = w.exercises.reduce((acc, ex) => {
      return acc + ex.sets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0);
    }, 0);
    return { ...w, totalVolume };
  });

  return NextResponse.json({
    workouts: enriched,
    nextCursor: workouts.length === limit ? workouts[workouts.length - 1].id : null,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Abandon any lingering in_progress workout before starting a new one
  await prisma.workout.updateMany({
    where:  { userId: session.user.id, status: "in_progress" },
    data:   { status: "completed", completedAt: new Date() },
  });

  const body = await req.json().catch(() => ({}));
  const workout = await prisma.workout.create({
    data: {
      userId: session.user.id,
      name:   body.name ?? null,
      status: "in_progress",
    },
  });

  return NextResponse.json(workout, { status: 201 });
}
