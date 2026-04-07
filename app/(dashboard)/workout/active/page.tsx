import { Suspense } from "react";
import ActiveWorkout from "@/components/workout/ActiveWorkout";

export const metadata = { title: "FitTrack — Séance en cours" };

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function ActiveWorkoutPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ActiveWorkout />
    </Suspense>
  );
}
