/**
 * POST   /api/workouts/:id/exercises/:exerciseId/sets — Add a set
 * PATCH  /api/workouts/:id/exercises/:exerciseId/sets — Update a set
 * DELETE /api/workouts/:id/exercises/:exerciseId/sets — Delete last set
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

const setSchema = z.object({
  weight:      z.number().min(0).max(2000).nullable().optional(),
  reps:        z.number().int().min(0).max(9999).nullable().optional(),
  type:        z.enum(["normal","warmup","dropset","failure"]).optional(),
  isCompleted: z.boolean().optional(),
  setId:       z.string().optional(), // for PATCH
});

type Params = { params: { id: string; exerciseId: string } };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Verify the workout belongs to the user
  const workout = await prisma.workout.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!workout) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body   = await req.json();
  const parsed = setSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  // Compute next set number
  const count = await prisma.workoutSet.count({ where: { workoutExerciseId: params.exerciseId } });

  const set = await prisma.workoutSet.create({
    data: {
      workoutExerciseId: params.exerciseId,
      setNumber:   count + 1,
      weight:      parsed.data.weight  ?? null,
      reps:        parsed.data.reps    ?? null,
      type:        parsed.data.type    ?? "normal",
      isCompleted: parsed.data.isCompleted ?? false,
    },
  });

  return NextResponse.json(set, { status: 201 });
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body   = await req.json();
  const parsed = setSchema.safeParse(body);
  if (!parsed.success || !parsed.data.setId) {
    return NextResponse.json({ error: "setId requis" }, { status: 400 });
  }

  const set = await prisma.workoutSet.update({
    where: { id: parsed.data.setId },
    data: {
      weight:      parsed.data.weight      !== undefined ? parsed.data.weight      : undefined,
      reps:        parsed.data.reps        !== undefined ? parsed.data.reps        : undefined,
      isCompleted: parsed.data.isCompleted !== undefined ? parsed.data.isCompleted : undefined,
      type:        parsed.data.type        !== undefined ? parsed.data.type        : undefined,
    },
  });

  return NextResponse.json(set);
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { setId } = await req.json();
  if (!setId) return NextResponse.json({ error: "setId requis" }, { status: 400 });

  await prisma.workoutSet.delete({ where: { id: setId } });
  return NextResponse.json({ success: true });
}
