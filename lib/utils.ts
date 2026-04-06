import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format seconds into mm:ss */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Format a date to French locale */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Format a date to short French locale */
export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Epley formula for estimated 1RM
 * 1RM ≈ weight × (1 + reps / 30)
 */
export function calc1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/** Muscle group labels in French */
export const MUSCLE_LABELS: Record<string, string> = {
  chest: "Pectoraux",
  back: "Dos",
  legs: "Jambes",
  shoulders: "Épaules",
  arms: "Bras",
  core: "Abdominaux",
  full_body: "Full Body",
};

/** Equipment labels in French */
export const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: "Barre",
  dumbbell: "Haltères",
  cable: "Poulie",
  machine: "Machine guidée",
  bodyweight: "Poids du corps",
  kettlebell: "Kettlebell",
  other: "Autre",
};

/** Category labels */
export const CATEGORY_LABELS: Record<string, string> = {
  strength: "Force",
  cardio: "Cardio",
  olympic: "Haltérophilie",
  stretching: "Étirements",
};
