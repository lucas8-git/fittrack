import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; exerciseId: string } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { weight, reps, isCompleted } = body;

    const set = await prisma.workoutSet.create({
      data: {
        workoutExerciseId: params.exerciseId,
        weight: weight || 0,
        reps: reps || 0,
        isCompleted: isCompleted || false,
      },
    });

    return NextResponse.json(set, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create set" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; exerciseId: string } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { setId, weight, reps, isCompleted } = body;

    const set = await prisma.workoutSet.update({
      where: { id: setId },
      data: {
        weight: weight || undefined,
        reps: reps || undefined,
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
      },
    });

    return NextResponse.json(set);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update set" }, { status: 500 });
  }
}
