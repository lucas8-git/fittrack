"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, Plus, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MUSCLE_LABELS, EQUIPMENT_LABELS } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import type { Exercise } from "@prisma/client";

// ─── Filter definitions ───────────────────────────────────────────────────────
const MUSCLE_FILTERS = [
  { value: "all",        label: "Tout" },
  { value: "chest",      label: "Pectoraux" },
  { value: "back",       label: "Dos" },
  { value: "legs",       label: "Jambes" },
  { value: "shoulders",  label: "Épaules" },
  { value: "arms",       label: "Bras" },
  { value: "core",       label: "Abdos" },
  { value: "full_body",  label: "Full Body" },
];

const EQUIPMENT_FILTERS = [
  { value: "all",        label: "Tout" },
  { value: "barbell",    label: "Barre" },
  { value: "dumbbell",   label: "Haltères" },
  { value: "cable",      label: "Poulie" },
  { value: "machine",    label: "Machine guidée" },
  { value: "bodyweight", label: "Poids du corps" },
  { value: "kettlebell", label: "Kettlebell" },
];

const MUSCLE_ACCENT: Record<string, "blue" | "green" | "orange" | "gold"> = {
  chest: "blue", back: "green", legs: "orange", shoulders: "blue",
  arms: "gold", core: "green", full_body: "orange",
};

// ─── Sub-component: filter chip row ──────────────────────────────────────────
function FilterRow({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              value === item.value
                ? "bg-primary-500 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-component: exercise card ────────────────────────────────────────────
function ExerciseCard({
  exercise,
  onSelect,
}: {
  exercise: Exercise;
  onSelect?: (ex: Exercise) => void;
}) {
  const accent = MUSCLE_ACCENT[exercise.muscleGroup] ?? "blue";
  const muscleLabel = MUSCLE_LABELS[exercise.muscleGroup] ?? exercise.muscleGroup;
  const equipLabel  = EQUIPMENT_LABELS[exercise.equipment] ?? exercise.equipment;

  return (
    <div
      onClick={() => onSelect?.(exercise)}
      className={cn(
        "bg-white rounded-2xl shadow-card overflow-hidden flex items-stretch",
        onSelect && "cursor-pointer hover:shadow-card-hover active:scale-[0.99] transition-all"
      )}
    >
      <div
        className={cn(
          "w-1 shrink-0",
          accent === "blue"   && "bg-primary-500",
          accent === "green"  && "bg-success",
          accent === "orange" && "bg-warning",
          accent === "gold"   && "bg-gold"
        )}
      />

      <div className="p-3 flex items-center">
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
          accent === "blue"   && "bg-primary-50",
          accent === "green"  && "bg-success-light",
          accent === "orange" && "bg-warning-light",
          accent === "gold"   && "bg-gold-light"
        )}>
          <span className="text-xl">🏋️</span>
        </div>
      </div>

      <div className="flex-1 py-3 pr-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {exercise.name}
          </p>
          {exercise.isCustom && (
            <Badge variant="gold" className="shrink-0">Perso</Badge>
          )}
        </div>
        <p className="text-xs text-neutral-400 mt-0.5">{muscleLabel}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Badge variant="neutral">{equipLabel}</Badge>
        </div>
      </div>

      {onSelect && (
        <div className="flex items-center pr-3">
          <ChevronRight size={16} className="text-neutral-300" />
        </div>
      )}
    </div>
  );
}

// ─── Exercise Detail Sheet ────────────────────────────────────────────────────
function ExerciseSheet({
  exercise,
  onClose,
}: {
  exercise: Exercise | null;
  onClose: () => void;
}) {
  if (!exercise) return null;
  const muscleLabel = MUSCLE_LABELS[exercise.muscleGroup] ?? exercise.muscleGroup;
  const equipLabel  = EQUIPMENT_LABELS[exercise.equipment] ?? exercise.equipment;
  const accent = MUSCLE_ACCENT[exercise.muscleGroup] ?? "blue";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-3xl p-6 pb-10 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{exercise.name}</h2>
            <p className="text-sm text-neutral-400 mt-0.5">{muscleLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
          >
            <X size={15} className="text-neutral-500" />
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          <Badge variant="neutral">{equipLabel}</Badge>
          <Badge variant={accent === "blue" ? "blue" : accent === "green" ? "green" : "orange"}>
            {exercise.category === "strength" ? "Force" :
             exercise.category === "cardio"   ? "Cardio" :
             exercise.category === "olympic"  ? "Haltérophilie" : "Étirements"}
          </Badge>
        </div>

        {exercise.instructions && (
          <>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
              Technique
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {exercise.instructions}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ExerciseLibrary({ userId }: { userId: string }) {
  const [exercises,   setExercises]   = useState<Exercise[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [muscle,      setMuscle]      = useState("all");
  const [equipment,   setEquipment]   = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selected,    setSelected]    = useState<Exercise | null>(null);
  const [showAdd,     setShowAdd]     = useState(false);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)    params.set("search",      search);
      if (muscle !== "all")    params.set("muscleGroup", muscle);
      if (equipment !== "all") params.set("equipment",   equipment);

      const res  = await fetch(`/api/exercises?${params}`);
      const data = await res.json();
      setExercises(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [search, muscle, equipment]);

  useEffect(() => {
    const t = setTimeout(fetchExercises, 300);
    return () => clearTimeout(t);
  }, [fetchExercises]);

  const activeFilterCount = (muscle !== "all" ? 1 : 0) + (equipment !== "all" ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary-500 pt-14 pb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Exercices</h1>
            <p className="text-primary-200 text-xs font-medium mt-0.5">
              {loading ? "Chargement..." : `${exercises.length} exercice${exercises.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un exercice..."
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} className="text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border-b border-neutral-100 px-4 py-3">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors",
            activeFilterCount > 0
              ? "bg-primary-100 text-primary-600"
              : "bg-neutral-100 text-neutral-500"
          )}
        >
          <SlidersHorizontal size={14} />
          Filtres
          {activeFilterCount > 0 && (
            <span className="bg-primary-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {showFilters && (
          <div className="mt-4 space-y-4">
            <FilterRow
              label="Groupe musculaire"
              items={MUSCLE_FILTERS}
              value={muscle}
              onChange={setMuscle}
            />
            <FilterRow
              label="Équipement"
              items={EQUIPMENT_FILTERS}
              value={equipment}
              onChange={setEquipment}
            />
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setMuscle("all"); setEquipment("all"); }}
                className="text-xs font-semibold text-primary-500"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-2.5 overflow-y-auto">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-20 animate-pulse shadow-card" />
          ))
        ) : exercises.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm font-semibold text-neutral-500">Aucun exercice trouvé</p>
            <p className="text-xs text-neutral-400 mt-1">Modifie tes filtres ou ajoute un exercice</p>
          </div>
        ) : (
          exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onSelect={setSelected}
            />
          ))
        )}
      </div>

      {selected && (
        <ExerciseSheet exercise={selected} onClose={() => setSelected(null)} />
      )}

      {showAdd && (
        <AddExerciseSheet
          onClose={() => setShowAdd(false)}
          onCreated={() => { setShowAdd(false); fetchExercises(); }}
        />
      )}
    </div>
  );
}

// ─── Add Custom Exercise Sheet ────────────────────────────────────────────────
function AddExerciseSheet({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name,         setName]         = useState("");
  const [muscleGroup,  setMuscleGroup]  = useState("chest");
  const [equipment,    setEquipment]    = useState("barbell");
  const [instructions, setInstructions] = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, muscleGroup, equipment, instructions }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error);
      } else {
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-t-3xl p-6 pb-10 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-foreground">Ajouter un exercice</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            <X size={15} className="text-neutral-500" />
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-500 block mb-1.5">Nom de l&apos;exercice</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)} required
            placeholder="Ex: Curl Zottman"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-500 block mb-1.5">Groupe musculaire</label>
            <select
              value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)}
              className="w-full px-3 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(MUSCLE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-500 block mb-1.5">Équipement</label>
            <select
              value={equipment} onChange={(e) => setEquipment(e.target.value)}
              className="w-full px-3 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(EQUIPMENT_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-500 block mb-1.5">Instructions (optionnel)</label>
          <textarea
            value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3}
            placeholder="Décris la technique..."
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="w-full py-3.5 bg-primary-500 text-white font-bold rounded-xl shadow-primary-glow disabled:opacity-60 text-sm"
        >
          {loading ? "Création..." : "Créer l'exercice"}
        </button>
      </form>
    </div>
  );
}
