import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user!.id!;

    const prs = await prisma.workoutSet.findMany({
      where: {
        workoutExercise: {
          workout: { userId, status: "completed" },
        },
        isCompleted: true,
        weight: { gt: 0 },
      },
      include: {
        workoutExercise: {
          include: {
            exercise: { select: { id: true, name: true, muscleGroup: true } },
          },
        },
      },
      orderBy: { weight: "desc" },
      take: 20,
    });

    const grouped = prs.reduce((acc, set) => {
      const id = set.workoutExercise.exercise.id;
      if (!acc[id]) {
        acc[id] = {
          exercise: set.workoutExercise.exercise,
          maxWeight: set.weight,
        };
      }
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(Object.values(grouped));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch PRs" }, { status: 500 });
  }
}
