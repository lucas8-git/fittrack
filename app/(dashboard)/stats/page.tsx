import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { calc1RM, formatDateShort, MUSCLE_LABELS } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

export const metadata = { title: "FitTrack — Stats & Records" };

export default async function StatsPage() {
  const session = await auth();
  const userId  = session!.user!.id!;

  // ── Fetch PRs ────────────────────────────────────────────────────────────
  const workoutExercises = await prisma.workoutExercise.findMany({
    where: { workout: { userId, status: "completed" } },
    include: {
      exercise: { select: { id: true, name: true, muscleGroup: true } },
      sets: {
        where:   { isCompleted: true, weight: { gt: 0 } },
        orderBy: { weight: "desc" },
        take: 1,
      },
      workout: { select: { startedAt: true } },
    },
  });

  type PR = { exercise: { id: string; name: string; muscleGroup: string }; weight: number; reps: number; date: Date; est1RM: number };
  const prMap = new Map<string, PR>();
  for (const we of workoutExercises) {
    if (!we.sets[0]) continue;
    const best = we.sets[0];
    const cur  = prMap.get(we.exerciseId);
    if (!cur || best.weight! > cur.weight) {
      prMap.set(we.exerciseId, {
        exercise: we.exercise,
        weight:   best.weight!,
        reps:     best.reps ?? 1,
        date:     we.workout.startedAt,
        est1RM:   calc1RM(best.weight!, best.reps ?? 1),
      });
    }
  }
  const prs = [...prMap.values()].sort((a, b) => b.weight - a.weight);

  // ── Fetch global stats ───────────────────────────────────────────────────
  const [totalWorkouts, lastWorkout] = await Promise.all([
    prisma.workout.count({ where: { userId, status: "completed" } }),
    prisma.workout.findFirst({
      where:   { userId, status: "completed" },
      orderBy: { startedAt: "desc" },
      select:  { startedAt: true },
    }),
  ]);

  const MUSCLE_COLORS: Record<string, string> = {
    chest:     "bg-primary-500",
    back:      "bg-success",
    legs:      "bg-warning",
    shoulders: "bg-primary-400",
    arms:      "bg-gold",
    core:      "bg-success",
    full_body: "bg-warning",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar
        title="Stats & Records"
        subtitle={`${totalWorkouts} séances · ${prs.length} PR`}
      />

      <div className="px-4 py-4 space-y-6">
        {/* ── Summary cards ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Séances",      value: String(totalWorkouts),  icon: "🗓" },
            { label: "Records",      value: String(prs.length),     icon: "🏆" },
            { label: "Dernière",
              value: lastWorkout
                ? formatDateShort(lastWorkout.startedAt)
                : "—",
              icon: "⚡" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl shadow-card p-3 text-center">
              <p className="text-xl mb-1">{card.icon}</p>
              <p className="text-lg font-extrabold text-foreground">{card.value}</p>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* ── PRs list ── */}
        {prs.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="text-4xl mb-3">🏋️</span>
            <p className="text-sm font-bold text-foreground">Pas encore de records</p>
            <p className="text-xs text-neutral-400 mt-1">
              Complète une séance pour voir tes PRs apparaître ici.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Records personnels
            </p>
            <div className="space-y-2.5">
              {prs.map((pr, i) => (
                <div key={pr.exercise.id} className="bg-white rounded-2xl shadow-card overflow-hidden flex items-stretch">
                  {/* Rank */}
                  <div className={`w-1 shrink-0 ${MUSCLE_COLORS[pr.exercise.muscleGroup] ?? "bg-primary-500"}`} />

                  {/* Trophy / rank number */}
                  <div className="px-3 py-4 flex items-center justify-center shrink-0">
                    {i < 3 ? (
                      <span className="text-lg">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400">
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Exercise info */}
                  <div className="flex-1 py-3 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{pr.exercise.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {MUSCLE_LABELS[pr.exercise.muscleGroup] ?? pr.exercise.muscleGroup}
                      {" · "}
                      {formatDateShort(pr.date)}
                    </p>
                  </div>

                  {/* PR value */}
                  <div className="px-3 py-3 flex flex-col items-end justify-center shrink-0">
                    <div className="bg-primary-100 text-primary-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      {pr.weight} kg × {pr.reps}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      1RM ≈ {pr.est1RM} kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
