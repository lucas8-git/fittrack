"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const DEMO_EMAIL = "demo@fittrack.app";
const DEMO_PASSWORD = "Demo@FitTrack1";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleDemoLogin() {
    setDemoLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      redirect: false,
    });

    if (!result?.error) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Démo", email: DEMO_EMAIL, password: DEMO_PASSWORD }),
    });

    if (res.ok) {
      await signIn("credentials", {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        redirect: false,
      });
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Impossible de créer le compte démo. Réessaie.");
      setDemoLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header bleu */}
      <div className="bg-primary-500 pt-16 pb-20 px-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">🏋️</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">FitTrack</h1>
        <p className="text-primary-200 text-sm mt-1">Commence ton suivi dès aujourd&apos;hui.</p>
      </div>

      {/* Card formulaire */}
      <div className="flex-1 -mt-8 mx-4">
        <div className="bg-white rounded-3xl shadow-card p-6">
          {/* Onglets */}
          <div className="flex bg-neutral-50 rounded-xl p-1 mb-6">
            <Link
              href="/login"
              className="flex-1 text-center py-2 text-sm font-medium text-neutral-400 rounded-lg hover:text-neutral-600 transition-colors"
            >
              Connexion
            </Link>
            <span className="flex-1 text-center py-2 text-sm font-semibold text-primary-500 bg-white rounded-lg shadow-sm">
              Inscription
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                Prénom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm text-foreground placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@gmail.com"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm text-foreground placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                Mot de passe{" "}
                <span className="font-normal text-neutral-400">(8 caractères min.)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm text-foreground placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm text-foreground placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-destructive-light text-destructive text-sm rounded-xl px-4 py-3 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-500 text-white font-bold rounded-xl shadow-primary-glow hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-60 text-sm"
            >
              {loading ? "Création du compte..." : "Créer mon compte →"}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 mt-5">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary-500 font-semibold">
              Se connecter
            </Link>
          </p>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-neutral-100" />
            <span className="text-xs text-neutral-400">ou</span>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          {/* Accès démo */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="w-full py-3 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-500 flex items-center justify-center gap-2 hover:bg-neutral-50 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>👀</span>
            <span>{demoLoading ? "Connexion en cours..." : "Continuer sans inscription"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
