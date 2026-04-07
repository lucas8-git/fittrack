"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play, Dumbbell } from "lucide-react";

export default function StartWorkout() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  async function startSession() {
    setLoading(true);
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const workout = await res.json();
    router.push(`/workout/active?id=${workout.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-primary-500 pt-14 pb-10 px-6 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Dumbbell size={30} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Nouvelle séance</h1>
        <p className="text-primary-200 text-sm mt-1">Mode libre — ajoute tes exercices au fur et à mesure</p>
      </div>

      <div className="px-4 -mt-5 space-y-3">
        {[
          { icon: "⚡", title: "Démarrage rapide",       desc: "Lance ta séance et ajoute tes exercices à la volée." },
          { icon: "💡", title: "Charge suggérée",         desc: "FitTrack te propose la charge de ta dernière série." },
          { icon: "⏱",  title: "Timer de repos intégré", desc: "Configure ton temps de repos par exercice." },
          { icon: "🏆", title: "PR automatiques",         desc: "Tes records sont détectés et célébrés en temps réel." },
        ].map((tip) => (
          <div key={tip.title} className="bg-white rounded-2xl shadow-card p-4 flex gap-3 items-start">
            <span className="text-2xl mt-0.5">{tip.icon}</span>
            <div>
              <p className="text-sm font-semibold text-foreground">{tip.title}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <button
          onClick={startSession}
          disabled={loading}
          className="w-full py-4 bg-primary-500 text-white font-bold rounded-2xl shadow-primary-glow flex items-center justify-center gap-2 text-base hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          <Play size={18} fill="white" />
          {loading ? "Démarrage..." : "Démarrer la séance"}
        </button>
      </div>
    </div>
  );
}
