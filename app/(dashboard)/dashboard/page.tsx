'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ActiveWorkout, Button, Card } from '@/components';
import { useDashboardStore } from '@/lib/store';
import { formatDate, formatDuration, MUSCLE_LABELS, calc1RM } from '@/lib/utils';

export const metadata = { title: "FitTrack – Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId  = session!.user!.id!;
  const name     = session!.user!.name ?? "Athlète";

  // 🔄🔄 Data queries (parallel) 🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄🔄
  const [recentWorkouts, weeklyCount, allTimeWorkouts, topPR] = await Promise.all([
    // Last 3 completed workouts
    prisma.workout.findMany({
      where:   { userId, status: "completed" },
      orderBy: { startedAt: "desc" },
      take:    3,
      include: {
        exercises: {
          include: {
            exercise: { select: { name: true, muscleGroup: true } },
            sets:    { where: { isCompleted: true } },
          },
        },
      },
    }),
    // Workouts this week
    prisma.workout.count({
      where: {
        userId,
        status:     "completed",
        startedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    // Total workouts ever
    prisma.workout.count({ where: { userId, status: "completed" } }),
    // Top PR
    prisma.workoutSet.findFirst({
      where: {
        isCompleted:    true,
        weight:         { gt: 0 },
        workoutExercise: { workout: { userId, status: "completed" } },
      },
      orderBy: { weight: "desc" },
      include: { workoutExercise: { include: { exercise: { select: { name: true } } } } },
    }),
  ]);

  // Active workout check
  const activeWorkout = await prisma.workout.findFirst({
    where:  { userId, status: "in_progress" },
    select: { id: true },
  });

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Bonjour" : greetingHour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 🔄🔄 Header 🔄🔄 */}
      <div className="bg-primary-500 pt-14 pb-8 px-5">
        <p className="text-primary-200 text-sm font-medium">{greeting},</p>
        <h1 className="text-2xl font-extrabold text-white mt-0.5">{name} 💪</h1>

        {/* Quick stats */}
        <div className="flex gap-3 mt-4">
          {[
            { label: "Cette semaine", value: `${weeklyCount} séance${weeklyCount !== 1 ? "s" : ""}`, icon: <Flame size={14} /> },
            { label: "Au total",      value: `${allTimeWorkouts} séances`,                 icon: <TrendingUp size={14} /> },
          ].map((s) => (
            <div key={s.label} className="flex-1 bg-white/15 rounded-2xl px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-primary-200 text-xs mb-1">
                {s.icon}
                <span>{s.label}</span>
              </div>
              <p className="text-white font-bold text-sm">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-6">
        {/* 🔄🔄 CTA: Start or Resume workout 🔄🔄 */}
        {activeWorkout ? (
          <Link
            href={`/workout/active?id=${activeWorkout.id}`}
            className="block bg-warning text-white rounded-2xl p-4 shadow-lg flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Play size={18} fill="white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Séance en cours</p>
              <p className="text-xs text-white/80 mt-0.5">Reprends là où tu t'étais arrêté 👉</p>
            </div>
          </Link>
        ) : (
          <Link
            href="/workout"
            className="block bg-primary-500 text-white rounded-2xl p-4 shadow-primary-glow flex items-center gap-3 hover:bg-primary-600 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Play size={18} fill="white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Démarrer une séance</p>
              <p className="text-xs text-primary-200 mt-0.5">Mode libre – ajoute tes exercices</p>
            </div>
          </Link>
        )}

        {/* 🔄🔄 Top PR banner 🔄🔄 */}
        {topPR && (
          <div className="bg-gold-light border border-gold/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl shrink-0">🏆</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">
                Meilleur record
              </p>
              <p className="text-sm font-bold text-foreground truncate">
                {topPR.workoutExercise.exercise.name}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-extrabold text-yellow-700">{topPR.weight} kg</p>
              <p className="text-[10px] text-yellow-600">
                1RM → {calc1RM(topPR.weight!, topPR.reps ?? 1)} kg
              </p>
            </div>
          </div>
        )}

        {/* 🔄🔄 Recent sessions 🔄🔄 */}
        {recentWorkouts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Séances récentes
              </p>
              <Link href="/history" className="text-xs font-semibold text-primary-500 flex items-center gap-0.5">
                Voir tout <ChevronRight size={12} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentWorkouts.map((w) => {
                const totalVol = w.exercises.reduce(
                  (a, e) => a + e.sets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0),
                  0
                );
                const muscles = [...new Set(w.exercises.map((e) => e.exercise.muscleGroup))];

                return (
                  <div key={w.id} className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                      <Dumbbell size={18} className="text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{formatDate(w.startedAt)}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">
                        {muscles.slice(0, 2).map((m) => MUSCLE_LABELS[m] ?? m).join(" • ")}
                        {muscles.length > 2 && ` +${muscles.length - 2}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {w.duration && (
                        <p className="text-xs font-semibold text-neutral-500">{formatDuration(w.duration)}</p>
                      )}
                      {totalVol > 0 && (
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {Math.round(totalVol).toLocaleString("fr-FR")} kg
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 🔄🔄 Empty state 🔄🔄 */}
        {recentWorkouts.length === 0 && !activeWorkout && (
          <div className="bg-white rounded-2xl shadow-card p-6 text-center">
            <span className="text-3xl">🙏</span>
            <p className="text-sm font-bold text-foreground mt-3">Prêt à commencer ?</p>
            <p className="text-xs text-neutral-400 mt-1">
              Démarre ta première séance pour voir ta progression ici.
            </p>
          </div>
        )}

        {/* 🔄🔄 Quick nav shortcuts 🔄🔄 */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/exercises", label: "Exercices",    icon: "💪", sub: "50 disponibles"   },
            { href: "/stats",     label: "Mes records",  icon: "🏆", sub: `${0} PR enregistrés` },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl shadow-card p-4 flex flex-col gap-1 hover:shadow-card-hover active:scale-[0.98] transition-all"
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-bold text-foreground mt-1">{item.label}</p>
              <p className="text-xs text-neutral-400">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
                }
