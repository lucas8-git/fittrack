import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user!.id!;
    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    return NextResponse.json(workouts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user!.id!;
    const workout = await prisma.workout.create({
      data: {
        userId,
        status: "in_progress",
        startedAt: new Date(),
      },
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}
