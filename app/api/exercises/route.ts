/**
 * GET /api/exercises
 * Returns exercises with optional filters: muscleGroup, equipment, search.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search      = searchParams.get("search")?.trim() || "";
  const muscleGroup = searchParams.get("muscleGroup") || "";
  const equipment   = searchParams.get("equipment") || "";

  const exercises = await prisma.exercise.findMany({
    where: {
      AND: [
        // Search by name (case-insensitive via contains)
        search
          ? { name: { contains: search, mode: "insensitive" } }
          : {},
        // Filter by muscle group
        muscleGroup && muscleGroup !== "all"
          ? { muscleGroup }
          : {},
        // Filter by equipment
        equipment && equipment !== "all"
          ? { equipment }
          : {},
        // Show global exercises + user's custom ones
        {
          OR: [
            { isCustom: false },
            { isCustom: true, userId: session.user.id },
          ],
        },
      ],
    },
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(exercises);
}

/**
 * POST /api/exercises
 * Creates a custom exercise for the authenticated user.
 */
const createSchema = z.object({
  name:        z.string().min(2).max(100),
  muscleGroup: z.enum(["chest","back","legs","shoulders","arms","core","full_body"]),
  equipment:   z.enum(["barbell","dumbbell","cable","machine","bodyweight","kettlebell","other"]).optional(),
  description: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body   = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.create({
      data: {
        ...parsed.data,
        isCustom: true,
        userId:   session.user.id,
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
