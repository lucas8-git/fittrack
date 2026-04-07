"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Check, Trash2, X, ChevronDown, ChevronUp, Timer, Trophy } from "lucide-react";
import { cn, formatDuration, MUSCLE_LABELS } from "@/lib/utils";
import type { Exercise, WorkoutSet } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SetRow {
  id:          string;
  setNumber:   number;
  weight:      number | null;
  reps:        number | null;
  isCompleted: boolean;
  type:        string;
  isNew?:      boolean;
}
interface ExerciseBlock {
  id:          string;
  exerciseId:  string;
  exercise:    Exercise;
  sets:        SetRow[];
  collapsed:   boolean;
}

// ─── Set row component ────────────────────────────────────────────────────────
function SetRowItem({
  set,
  weId,
  workoutId,
  suggestion,
  onChange,
  onDelete,
}: {
  set:       SetRow;
  weId:      string;
  workoutId: string;
  suggestion?: number | null;
  onChange:  (updated: SetRow) => void;
  onDelete:  (setId: string) => void;
}) {
  const [weight, setWeight] = useState(String(set.weight ?? ""));
  const [reps,   setReps]   = useState(String(set.reps   ?? ""));
  const [saving, setSaving] = useState(false);
  const [isPR,   setIsPR]   = useState(false);

  async function saveSet(completed: boolean) {
    setSaving(true);
    const w = parseFloat(weight) || null;
    const r = parseInt(reps)     || null;

    if (set.id.startsWith("temp-")) {
      const res = await fetch(
        `/api/workouts/${workoutId}/exercises/${weId}/sets`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ weight: w, reps: r, isCompleted: completed }),
        }
      );
      const created = await res.json() as WorkoutSet;
      if (w && suggestion && w > suggestion) setIsPR(true);
      onChange({ ...set, id: created.id, weight: w, reps: r, isCompleted: completed });
    } else {
      await fetch(`/api/workouts/${workoutId}/exercises/${weId}/sets`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ setId: set.id, weight: w, reps: r, isCompleted: completed }),
      });
      if (w && suggestion && w > suggestion) setIsPR(true);
      onChange({ ...set, weight: w, reps: r, isCompleted: completed });
    }
    setSaving(false);
  }

  return (
    <div className={cn(
      "flex items-center gap-2 py-2 px-3 rounded-xl transition-colors",
      set.isCompleted ? "bg-success-light/60" : "bg-neutral-50"
    )}>
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
        set.isCompleted ? "bg-success text-white" : "bg-neutral-200 text-neutral-500"
      )}>
        {isPR ? "🏆" : set.setNumber}
      </div>

      <div className="flex-1">
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={suggestion ? String(suggestion) : "kg"}
            className={cn(
              "w-full px-3 py-2 rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all",
              set.isCompleted
                ? "bg-white border border-success/30 text-success"
                : "bg-white border border-neutral-200 text-foreground"
            )}
          />
          {suggestion && !weight && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">
              💡{suggestion}
            </span>
          )}
        </div>
        <p className="text-[10px] text-center text-neutral-400 mt-0.5">kg</p>
      </div>

      <div className="flex-1">
        <input
          type="number"
          inputMode="numeric"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="reps"
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all",
            set.isCompleted
              ? "bg-white border border-success/30 text-success"
              : "bg-white border border-neutral-200 text-foreground"
          )}
        />
        <p className="text-[10px] text-center text-neutral-400 mt-0.5">reps</p>
      </div>

      <button
        onClick={() => saveSet(!set.isCompleted)}
        disabled={saving}
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90",
          set.isCompleted
            ? "bg-success text-white"
            : "bg-neutral-200 text-neutral-400 hover:bg-primary-100 hover:text-primary-500"
        )}
      >
        {saving ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Check size={16} strokeWidth={2.5} />
        )}
      </button>

      <button
        onClick={() => onDelete(set.id)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-300 hover:text-destructive hover:bg-destructive-light transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ─── Exercise block component ─────────────────────────────────────────────────
function ExerciseBlockItem({
  block,
  workoutId,
  onUpdate,
  onRemove,
}: {
  block:     ExerciseBlock;
  workoutId: string;
  onUpdate:  (updated: ExerciseBlock) => void;
  onRemove:  (id: string) => void;
}) {
  const completedSets = block.sets.filter((s) => s.isCompleted).length;
  const suggestion = block.sets
    .filter((s) => s.isCompleted && s.weight)
    .reduce<number | null>((max, s) => (s.weight! > (max ?? 0) ? s.weight : max), null);

  function addSet() {
    const newSet: SetRow = {
      id:          `temp-${Date.now()}`,
      setNumber:   block.sets.length + 1,
      weight:      suggestion,
      reps:        null,
      isCompleted: false,
      type:        "normal",
      isNew:       true,
    };
    onUpdate({ ...block, sets: [...block.sets, newSet] });
  }

  function handleSetChange(updated: SetRow) {
    onUpdate({
      ...block,
      sets: block.sets.map((s) => (s.setNumber === updated.setNumber ? updated : s)),
    });
  }

  async function handleDeleteSet(setId: string) {
    if (!setId.startsWith("temp-")) {
      await fetch(`/api/workouts/${workoutId}/exercises/${block.id}/sets`, {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ setId }),
      });
    }
    onUpdate({
      ...block,
      sets: block.sets
        .filter((s) => s.id !== setId)
        .map((s, i) => ({ ...s, setNumber: i + 1 })),
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-neutral-50">
        <div className="w-1 self-stretch bg-primary-500 rounded-full" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{block.exercise.name}</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            {MUSCLE_LABELS[block.exercise.muscleGroup] ?? block.exercise.muscleGroup}
            {completedSets > 0 && (
              <span className="ml-2 text-success font-semibold">
                · {completedSets}/{block.sets.length} séries
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdate({ ...block, collapsed: !block.collapsed })}
            className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center"
          >
            {block.collapsed
              ? <ChevronDown size={15} className="text-neutral-400" />
              : <ChevronUp   size={15} className="text-neutral-400" />
            }
          </button>
          <button
            onClick={() => onRemove(block.id)}
            className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center"
          >
            <X size={14} className="text-neutral-400" />
          </button>
        </div>
      </div>

      {!block.collapsed && (
        <div className="p-3 space-y-2">
          {block.sets.length > 0 && (
            <div className="flex items-center gap-2 px-3 mb-1">
              <div className="w-7" />
              <p className="flex-1 text-[10px] font-semibold text-center text-neutral-400 uppercase tracking-wide">Poids</p>
              <p className="flex-1 text-[10px] font-semibold text-center text-neutral-400 uppercase tracking-wide">Reps</p>
              <div className="w-9" />
              <div className="w-7" />
            </div>
          )}

          {block.sets.map((set) => (
            <SetRowItem
              key={set.id}
              set={set}
              weId={block.id}
              workoutId={workoutId}
              suggestion={suggestion}
              onChange={handleSetChange}
              onDelete={handleDeleteSet}
            />
          ))}

          <button
            onClick={addSet}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-neutral-200 text-xs font-semibold text-neutral-400 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={13} />
            Ajouter une série
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Exercise picker modal ────────────────────────────────────────────────────
function ExercisePicker({
  workoutId,
  onPicked,
  onClose,
}: {
  workoutId: string;
  onPicked:  (block: ExerciseBlock) => void;
  onClose:   () => void;
}) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search,    setSearch]    = useState("");
  const [muscle,    setMuscle]    = useState("all");

  const MUSCLES = [
    { v: "all", l: "Tout" }, { v: "chest", l: "Pecto" }, { v: "back", l: "Dos" },
    { v: "legs", l: "Jambes" }, { v: "shoulders", l: "Épaules" },
    { v: "arms", l: "Bras" }, { v: "core", l: "Abdos" },
  ];

  useEffect(() => {
    const t = setTimeout(async () => {
      const p = new URLSearchParams();
      if (search) p.set("search", search);
      if (muscle !== "all") p.set("muscleGroup", muscle);
      const res  = await fetch(`/api/exercises?${p}`);
      const data = await res.json();
      setExercises(Array.isArray(data) ? data : []);
    }, 250);
    return () => clearTimeout(t);
  }, [search, muscle]);

  async function pick(ex: Exercise) {
    const res  = await fetch(`/api/workouts/${workoutId}/exercises`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ exerciseId: ex.id }),
    });
    const we = await res.json();
    onPicked({ ...we, exercise: ex, sets: [], collapsed: false });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mt-auto bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: "85vh" }}>
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-neutral-100 shrink-0">
          <h3 className="text-base font-bold text-foreground">Choisir un exercice</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            <X size={15} />
          </button>
        </div>

        <div className="px-4 py-3 shrink-0">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide shrink-0">
          {MUSCLES.map((m) => (
            <button
              key={m.v}
              onClick={() => setMuscle(m.v)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold",
                muscle === m.v ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-500"
              )}
            >
              {m.l}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-4 pb-8 space-y-2">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => pick(ex)}
              className="w-full text-left bg-neutral-50 hover:bg-primary-50 active:bg-primary-100 rounded-xl p-3.5 flex items-center gap-3 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <span className="text-lg">🏋️</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{ex.name}</p>
                <p className="text-xs text-neutral-400">
                  {MUSCLE_LABELS[ex.muscleGroup]} · {ex.equipment}
                </p>
              </div>
              <Plus size={16} className="ml-auto shrink-0 text-primary-400" />
            </button>
          ))}
          {exercises.length === 0 && (
            <p className="text-center text-sm text-neutral-400 py-8">Aucun exercice trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ActiveWorkout component ────────────────────────────────────────────
export default function ActiveWorkout() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const workoutId    = searchParams.get("id") ?? "";

  const [blocks,      setBlocks]      = useState<ExerciseBlock[]>([]);
  const [showPicker,  setShowPicker]  = useState(false);
  const [finishing,   setFinishing]   = useState(false);
  const [elapsed,     setElapsed]     = useState(0);
  const [restTimer,   setRestTimer]   = useState<number | null>(null);
  const [restRunning, setRestRunning] = useState(false);
  const intervalRef   = useRef<ReturnType<typeof setInterval>>();
  const restRef       = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (restRunning && restTimer !== null && restTimer > 0) {
      restRef.current = setInterval(() => setRestTimer((t) => (t ?? 0) - 1), 1000);
    } else {
      clearInterval(restRef.current);
      if (restTimer === 0) setRestRunning(false);
    }
    return () => clearInterval(restRef.current);
  }, [restRunning, restTimer]);

  function startRest(seconds = 90) {
    setRestTimer(seconds);
    setRestRunning(true);
  }

  function handlePicked(block: ExerciseBlock) {
    setBlocks((prev) => [...prev, block]);
  }

  function handleUpdate(updated: ExerciseBlock) {
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  function handleRemove(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  async function finishWorkout() {
    setFinishing(true);
    await fetch(`/api/workouts/${workoutId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: "completed", duration: elapsed }),
    });
    router.push("/history?finished=1");
  }

  const completedSets = blocks.reduce(
    (acc, b) => acc + b.sets.filter((s) => s.isCompleted).length,
    0
  );
  const totalVolume = blocks.reduce(
    (acc, b) =>
      acc + b.sets
        .filter((s) => s.isCompleted)
        .reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0),
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-30 bg-primary-500 px-4 pt-12 pb-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-primary-200 font-medium">Séance en cours</p>
            <p className="text-2xl font-bold text-white font-mono tabular-nums">
              {formatDuration(elapsed)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-primary-200">{completedSets} séries · {Math.round(totalVolume)} kg</p>
            <button
              onClick={finishWorkout}
              disabled={finishing}
              className="mt-1 px-4 py-2 bg-white text-primary-600 text-sm font-bold rounded-xl hover:bg-primary-50 active:scale-95 transition-all disabled:opacity-60"
            >
              {finishing ? "Enregistrement..." : "Terminer ✓"}
            </button>
          </div>
        </div>

        {restRunning && restTimer !== null && restTimer > 0 && (
          <div className="bg-white/20 rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer size={14} className="text-white" />
              <span className="text-xs text-white font-medium">Repos</span>
            </div>
            <span className="text-white font-bold font-mono">{formatDuration(restTimer)}</span>
            <button
              onClick={() => { setRestRunning(false); setRestTimer(null); }}
              className="text-white/60 text-xs"
            >
              Passer
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-4 space-y-3">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
              <Trophy size={28} className="text-primary-500" />
            </div>
            <p className="text-base font-bold text-foreground">Ajoute ton premier exercice</p>
            <p className="text-sm text-neutral-400 mt-1">Appuie sur le bouton ci-dessous pour commencer</p>
          </div>
        ) : (
          blocks.map((block) => (
            <ExerciseBlockItem
              key={block.id}
              block={block}
              workoutId={workoutId}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))
        )}

        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-primary-200 text-sm font-semibold text-primary-500 hover:bg-primary-50 hover:border-primary-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Ajouter un exercice
        </button>

        {blocks.length > 0 && !restRunning && (
          <button
            onClick={() => startRest(90)}
            className="w-full py-3 rounded-2xl bg-neutral-100 text-sm font-semibold text-neutral-500 hover:bg-neutral-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Timer size={16} />
            Timer de repos — 1:30
          </button>
        )}
      </div>

      {showPicker && (
        <ExercisePicker
          workoutId={workoutId}
          onPicked={handlePicked}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
