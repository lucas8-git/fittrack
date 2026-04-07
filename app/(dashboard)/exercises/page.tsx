import ExerciseLibrary from "@/components/exercises/ExerciseLibrary";
import { auth } from "@/auth";

export const metadata = { title: "FitTrack — Exercices" };

export default async function ExercisesPage() {
  const session = await auth();
  return <ExerciseLibrary userId={session!.user!.id!} />;
}
