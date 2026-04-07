import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import StartWorkout from "@/components/workout/StartWorkout";

export const metadata = { title: "FitTrack — Nouvelle séance" };

export default async function WorkoutPage() {
  const session = await auth();

  // Check if there's already an in-progress workout
  const active = await prisma.workout.findFirst({
    where: { userId: session!.user!.id!, status: "in_progress" },
    select: { id: true },
  });

  if (active) redirect(`/workout/active?id=${active.id}`);

  return <StartWorkout />;
}
