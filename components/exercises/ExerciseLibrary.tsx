'use client';

import { useMemo, useState } from 'react';
import { Exercise } from '@prisma/client';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { MUSCLE_LABELS } from '@/lib/utils';

export function ExerciseLibrary({ exercises }: { exercises: Exercise[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return exercises
      .filter((ex) =>
        (selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle) &&
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.muscleGroup.localeCompare(b.muscleGroup));
  }, [exercises, selectedMuscle, searchTerm]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, ex) => {
      if (!acc[ex.muscleGroup]) {
        acc[ex.muscleGroup] = [];
      }
      acc[ex.muscleGroup].push(ex);
      return acc;
    }, {} as Record<string, Exercise[]>);
  }, [filtered]);

  const muscleGroups = useMemo(
    () => [...new Set(exercises.map((e) => e.muscleGroup))].sort(),
    [exercises]
  );

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cherche un exercice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">Tous les groupes musculaires</option>
          {muscleGroups.map((group) => (
            <option key={group} value={group}>
              {MUSCLE_LABELS[group] || group}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([group, groupExercises]) => (
          <div key={group} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {MUSCLE_LABELS[group] || group}
                </span>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {groupExercises.length}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedGroups[group] ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedGroups[group] && (
              <div className="border-t border-neutral-100 divide-y divide-neutral-100">
                {groupExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <p className="font-medium text-foreground">{exercise.name}</p>
                    {exercise.notes && (
                      <p className="text-xs text-neutral-500 mt-1">{exercise.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-sm font-semibold text-foreground">Aucun exercice trouvé</p>
            <p className="text-xs text-neutral-500 mt-1">
              Essaie une autre recherche ou un autre groupe musculaire
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
