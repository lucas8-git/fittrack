/**
 * GET    /api/workouts/:id — Get a single workout with all exercises & sets
 * PATCH  /api/workouts/:id — Update workout (finish it, add notes, etc.)
 * DELETE /api/workouts/:id — Delete a workout
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const workout = await prisma.workout.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: {
          exercise: true,
          sets:     { orderBy: { setNumber: "asc" } },
        },
      },
    },
  });

  if (!workout) return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });
  return NextResponse.json(workout);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  // Verify ownership
  const existing = await prisma.workout.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });

  const updated = await prisma.workout.update({
    where: { id: params.id },
    data: {
      status:     body.status     ?? existing.status,
      notes:      body.notes      ?? existing.notes,
      name:       body.name       ?? existing.name,
      finishedAt: body.status === "completed" ? new Date() : existing.finishedAt,
      duration:   body.duration   ?? existing.duration,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const existing = await prisma.workout.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });

  await prisma.workout.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
