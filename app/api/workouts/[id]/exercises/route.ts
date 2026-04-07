/**
 * POST /api/workouts/:id/exercises — Add an exercise to an active workout
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

const schema = z.object({
  exerciseId: z.string().cuid(),
  notes:      z.string().optional(),
});

type Params = { params: { id: string } };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const workout = await prisma.workout.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!workout) return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  // Compute next order
  const count = await prisma.workoutExercise.count({ where: { workoutId: params.id } });

  const we = await prisma.workoutExercise.create({
    data: {
      workoutId:  params.id,
      exerciseId: parsed.data.exerciseId,
      order:      count + 1,
      notes:      parsed.data.notes,
    },
    include: { exercise: true, sets: true },
  });

  return NextResponse.json(we, { status: 201 });
}
