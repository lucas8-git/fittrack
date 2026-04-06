/**
 * FitTrack — Database Seed
 * Seeds 50 foundational exercises covering all major muscle groups.
 * Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // ─── CHEST — Pectoraux (8) ────────────────────────────────────────────────────────────────────────
  {
    name: "Développé couché barre",
    category: "strength",
    muscleGroup: "chest",
    equipment: "barbell",
    instructions:
      "Allongé sur le banc, saisir la barre à largeur d'épaules+. Descendre jusqu'à effleurer la poitrine, pousser en expirant. Garder les omoplates rétractées.",
  },
  {
    name: "Développé couché haltères",
    category: "strength",
    muscleGroup: "chest",
    equipment: "dumbbell",
    instructions:
      "Allongé sur le banc, haltères alignés aux pectoraux. Pousser vers le haut en rapprochant les haltères au sommet. Amplitude complète.",
  },
  {
    name: "Développé incliné barre",
    category: "strength",
    muscleGroup: "chest",
    equipment: "barbell",
    instructions:
      "Banc incliné à 30-45°. Même technique que le développé couché. Cible le faisceau supérieur des pectoraux.",
  },
  {
    name: "Écarté haltères",
    category: "strength",
    muscleGroup: "chest",
    equipment: "dumbbell",
    instructions:
      "Allongé sur le banc, bras tendus en croix. Descendre en arc de cercle jusqu'à l'étirement, remonter en contractant les pectoraux.",
  },
  {
    name: "Pompes",
    category: "strength",
    muscleGroup: "chest",
    equipment: "bodyweight",
    instructions:
      "En appui sur les mains et les orteils, corps gainé. Descendre jusqu'à effleurer le sol, pousser jusqu'à extension complète.",
  },
  {
    name: "Dips pectoraux",
    category: "strength",
    muscleGroup: "chest",
    equipment: "bodyweight",
    instructions:
      "Sur les barres parallèles, se pencher légèrement en avant. Descendre jusqu'à 90° aux coudes, remonter. Pencher le tronc pour cibler les pectoraux.",
  },
  {
    name: "Poulie croisée haute",
    category: "strength",
    muscleGroup: "chest",
    equipment: "cable",
    instructions:
      "Poulies en position haute, se positionner au centre. Croiser les mains devant soi en contractant les pectoraux. Mouvement en arc de cercle.",
  },
  {
    name: "Développé couché prise serrée",
    category: "strength",
    muscleGroup: "chest",
    equipment: "barbell",
    instructions:
      "Comme le développé couché mais prise à largeur d'épaules. Cible davantage les triceps et le faisceau interne des pectoraux.",
  },

  // ─── BACK — Dos (8) ─────────────────────────────────────────────────────────────────────────────────
  {
    name: "Soulevé de terre",
    category: "strength",
    muscleGroup: "back",
    equipment: "barbell",
    instructions:
      "Pieds à largeur des hanches, barre au-dessus des pieds. Dos plat, hanches en arrière. Pousser le sol, hanches et épaules montent ensemble. Roi des exercices de dos.",
  },
  {
    name: "Tractions (Pull-ups)",
    category: "strength",
    muscleGroup: "back",
    equipment: "bodyweight",
    instructions:
      "Prise pronation à largeur d'épaules+. Partir bras tendus, tirer jusqu'au menton au-dessus de la barre. Contrôler la descente.",
  },
  {
    name: "Rowing barre (Bent-over row)",
    category: "strength",
    muscleGroup: "back",
    equipment: "barbell",
    instructions:
      "Dos penché à 45°, prise pronation. Tirer la barre vers le nombril en gardant les coudes proches. Contracter les dorsaux au sommet.",
  },
  {
    name: "Rowing haltère unilatéral",
    category: "strength",
    muscleGroup: "back",
    equipment: "dumbbell",
    instructions:
      "En appui sur un banc, tirer l'haltère vers la hanche. Amplitude maximale, rotation naturelle du tronc.",
  },
  {
    name: "Tirage vertical machine (Lat pulldown)",
    category: "strength",
    muscleGroup: "back",
    equipment: "machine",
    instructions:
      "Assis, prise large pronation. Tirer la barre vers le haut de la poitrine en rétractant les omoplates. Idéal pour les débutants.",
  },
  {
    name: "Tirage horizontal poulie",
    category: "strength",
    muscleGroup: "back",
    equipment: "cable",
    instructions:
      "Assis face à la poulie, tirer la poignée vers le nombril. Garder le dos droit, serrer les omoplates à l'arrivée.",
  },
  {
    name: "Good morning",
    category: "strength",
    muscleGroup: "back",
    equipment: "barbell",
    instructions:
      "Barre sur les trapèzes, jambes légèrement fléchies. Incliner le tronc jusqu'à l'horizontale en poussant les hanches en arrière. Stretching des ischio-jambiers.",
  },
  {
    name: "Shrugs barre",
    category: "strength",
    muscleGroup: "back",
    equipment: "barbell",
    instructions:
      "Barre en prise pronation, corps droit. Hausser les épaules vers les oreilles, maintenir 1s au sommet, descendre lentement. Cible les trapèzes.",
  },

  // ─── SHOULDERS — Épaules (6) ──────────────────────────────────────────────────────────────────────────
  {
    name: "Développé militaire barre",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "barbell",
    instructions:
      "Debout ou assis, barre à hauteur d'épaules. Pousser verticalement jusqu'à extension complète. Rentrer légèrement les côtes, gainage abdominal.",
  },
  {
    name: "Développé militaire haltères",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    instructions:
      "Haltères à hauteur d'oreilles. Pousser verticalement en rapprochant légèrement les haltères au sommet. Amplitude et liberté de mouvement accrues.",
  },
  {
    name: "Élévations latérales haltères",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    instructions:
      "Bras le long du corps, légèrement fléchis. Lever jusqu'à l'horizontale, pincer légèrement le majeur vers le bas (comme pour verser un verre).",
  },
  {
    name: "Élévations frontales haltères",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    instructions:
      "Alternativement ou simultanément, lever les bras vers l'avant jusqu'à l'horizontale. Cible le faisceau antérieur du deltoïde.",
  },
  {
    name: "Face pull poulie",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "cable",
    instructions:
      "Poulie haute avec corde. Tirer vers le visage en écartant les mains. Cible les faisceaux postérieurs et les rotateurs externes.",
  },
  {
    name: "Rowing menton barre",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "barbell",
    instructions:
      "Prise pronation serrée. Tirer la barre vers le menton, coudes au-dessus des poignets. Cible les deltoïdes et les trapèzes.",
  },

  // ─── LEGS — Jambes (8) ───────────────────────────────────────────────────────────────────────────────────
  {
    name: "Squat barre (Back squat)",
    category: "strength",
    muscleGroup: "legs",
    equipment: "barbell",
    instructions:
      "Barre sur les trapèzes, pieds à largeur d'épaules. Descendre jusqu'à ce que les cuisses soient parallèles au sol. Garder le dos droit, pousser les genoux vers l'extérieur.",
  },
  {
    name: "Squat goblet haltère",
    category: "strength",
    muscleGroup: "legs",
    equipment: "dumbbell",
    instructions:
      "Tenir l'haltère à deux mains devant la poitrine. Descendre profondément en gardant le torse vertical. Excellent pour les débutants.",
  },
  {
    name: "Fente marchée haltères",
    category: "strength",
    muscleGroup: "legs",
    equipment: "dumbbell",
    instructions:
      "Avancer en fente, genou arrière frôlant le sol. Alterner les jambes. Travaille la coordination et l'équilibre en plus de la force.",
  },
  {
    name: "Leg press machine",
    category: "strength",
    muscleGroup: "legs",
    equipment: "machine",
    instructions:
      "Dos bien plaqué contre le dossier. Descendre jusqu'à 90° aux genoux, ne pas décoller les fessiers. Poussée explosive.",
  },
  {
    name: "Extension quadriceps machine",
    category: "strength",
    muscleGroup: "legs",
    equipment: "machine",
    instructions:
      "Assis, chevilles sous le rouleau. Étendre les jambes jusqu'à extension complète, contracter les quadriceps au sommet. Descente contrôlée.",
  },
  {
    name: "Curl ischio-jambiers machine",
    category: "strength",
    muscleGroup: "legs",
    equipment: "machine",
    instructions:
      "Allongé sur la machine, rouleau aux chevilles. Ramener les talons vers les fessiers. Isolation parfaite des ischio-jambiers.",
  },
  {
    name: "Mollets debout",
    category: "strength",
    muscleGroup: "legs",
    equipment: "machine",
    instructions:
      "Debout sur la machine, appuis sur les épaules. Monter sur la pointe des pieds, maintenir 1s, descendre sous l'horizontale pour l'étirement.",
  },
  {
    name: "Hip thrust barre",
    category: "strength",
    muscleGroup: "legs",
    equipment: "barbell",
    instructions:
      "Dos appuyé sur un banc, barre sur les hanches. Pousser les hanches vers le haut jusqu'à alignement corps. Contracter fort les fessiers au sommet.",
  },

  // ─── ARMS — Bras (8) ────────────────────────────────────────────────────────────────────────────────────
  {
    name: "Curl biceps barre",
    category: "strength",
    muscleGroup: "arms",
    equipment: "barbell",
    instructions:
      "Prise supination, coudes collés au corps. Monter la barre jusqu'aux épaules, descendre lentement. Éviter le balancement du tronc.",
  },
  {
    name: "Curl biceps haltères",
    category: "strength",
    muscleGroup: "arms",
    equipment: "dumbbell",
    instructions:
      "Alternativement ou simultanément. Rotation du poignet en montant (supination). Amplitude complète.",
  },
  {
    name: "Curl marteau haltères",
    category: "strength",
    muscleGroup: "arms",
    equipment: "dumbbell",
    instructions:
      "Prise neutre (pouce vers le haut). Monte et descend sans rotation. Cible le brachial antérieur et le brachio-radial.",
  },
  {
    name: "Curl poulie basse",
    category: "strength",
    muscleGroup: "arms",
    equipment: "cable",
    instructions:
      "Poulie en position basse. Tension constante sur le biceps tout au long du mouvement. Excellent pour la congestion.",
  },
  {
    name: "Extension triceps poulie haute",
    category: "strength",
    muscleGroup: "arms",
    equipment: "cable",
    instructions:
      "Face à la poulie haute, coudes au corps. Étendre les bras vers le bas jusqu'à extension complète. Contracter les triceps.",
  },
  {
    name: "Dips triceps barre parallèles",
    category: "strength",
    muscleGroup: "arms",
    equipment: "bodyweight",
    instructions:
      "Corps vertical sur les barres parallèles. Descendre jusqu'à 90° aux coudes, remonter. Éviter le penché en avant pour isoler les triceps.",
  },
  {
    name: "Skullcrusher barre EZ",
    category: "strength",
    muscleGroup: "arms",
    equipment: "barbell",
    instructions:
      "Allongé sur le banc, barre EZ à bras tendus. Fléchir uniquement les coudes, descendre vers le front. Étirement maximal des triceps.",
  },
  {
    name: "Kickback triceps haltère",
    category: "strength",
    muscleGroup: "arms",
    equipment: "dumbbell",
    instructions:
      "Tronc penché à 90°, bras parallèle au corps. Étendre le bras jusqu'à la verticale. Contraction maximale des triceps en extension.",
  },

  // ─── CORE — Abdominaux (6) ───────────────────────────────────────────────────────────────────────────────
  {
    name: "Crunch",
    category: "strength",
    muscleGroup: "core",
    equipment: "bodyweight",
    instructions:
      "Allongé, genoux fléchis. Enrouler le tronc vers les genoux en contractant les abdominaux. Éviter de tirer sur la nuque.",
  },
  {
    name: "Planche (Plank)",
    category: "strength",
    muscleGroup: "core",
    equipment: "bodyweight",
    instructions:
      "En appui sur les coudes et les orteils. Corps aligné de la tête aux talons, gainage total. Respirer normalement.",
  },
  {
    name: "Crunch bicycle",
    category: "strength",
    muscleGroup: "core",
    equipment: "bodyweight",
    instructions:
      "Alterner coude droit vers genou gauche et inversement. Mouvement de pédalage. Cible les obliques et le droit de l'abdomen.",
  },
  {
    name: "Relevé de jambes suspendu",
    category: "strength",
    muscleGroup: "core",
    equipment: "bodyweight",
    instructions:
      "Suspendu à une barre fixe. Lever les jambes tendues jusqu'à l'horizontale ou plus. Contrôle total de la descente.",
  },
  {
    name: "Russian twist",
    category: "strength",
    muscleGroup: "core",
    equipment: "bodyweight",
    instructions:
      "Assis, dos incliné à 45°, pieds décollés. Rotation du tronc alternativement gauche/droite. Peut être alourdissant avec un disque.",
  },
  {
    name: "Gainage latéral",
    category: "strength",
    muscleGroup: "core",
    equipment: "bodyweight",
    instructions:
      "En appui sur un coude et le bord du pied. Corps aligné. Maintien isométrique. Cible les obliques.",
  },

  // ─── FULL BODY — Polyarticulaires (6) ────────────────────────────────────────────────────────────────────────
  {
    name: "Burpees",
    category: "cardio",
    muscleGroup: "full_body",
    equipment: "bodyweight",
    instructions:
      "Debout, s'abaisser, sauter en pompe, remonter et sauter verticalement avec les bras levés. Exercice de conditionnement cardiovasculaire total.",
  },
  {
    name: "Kettlebell swing",
    category: "strength",
    muscleGroup: "full_body",
    equipment: "kettlebell",
    instructions:
      "Pieds à largeur d'épaules, kettlebell entre les pieds. Projection explosive des hanches, laisser le kettlebell monter jusqu'à l'horizontale. Mouvement de charnière, pas de squat.",
  },
  {
    name: "Thruster haltères",
    category: "strength",
    muscleGroup: "full_body",
    equipment: "dumbbell",
    instructions:
      "Enchaîner un squat frontale et un développé militaire en un seul mouvement fluide. Excellent pour la condition physique générale.",
  },
  {
    name: "Soulevé de terre roumain",
    category: "strength",
    muscleGroup: "full_body",
    equipment: "barbell",
    instructions:
      "Comme le soulevé de terre classique mais jambes quasi-tendues. Descente avec poussée des hanches en arrière. Étirement fort des ischio-jambiers.",
  },
  {
    name: "Propulsion (Push press)",
    category: "olympic",
    muscleGroup: "full_body",
    equipment: "barbell",
    instructions:
      "Légère flexion des jambes puis extension explosive pour propulser la barre. Transfert de force des jambes vers les épaules. Variante dynamique du développé militaire.",
  },
  {
    name: "Arraché haltère",
    category: "olympic",
    muscleGroup: "full_body",
    equipment: "dumbbell",
    instructions:
      "D'un seul mouvement explosif, amener l'haltère du sol à bras tendu au-dessus de la tête. Coordination, puissance et mobilité.",
  },
];

async function main() {
  console.log("🌱 Seeding FitTrack database...");

  // Clear existing exercises to avoid duplicates on re-seed
  await prisma.exercise.deleteMany({ where: { isCustom: false } });

  let count = 0;
  for (const exercise of exercises) {
    await prisma.exercise.create({ data: exercise });
    count++;
  }

  console.log(`✅ Seeded ${count} exercises successfully.`);
  console.log(`
  ┌────────────────────────────────────────────────┐
  │  Exercises by muscle group:                    │
  │  • Chest (Pectoraux)    →  8                   │
  │  • Back (Dos)           →  8                   │
  │  • Shoulders (Épaules)  →  6                   │
  │  • Legs (Jambes)        →  8                   │
  │  • Arms (Bras)          →  8                   │
  │  • Core (Abdos)         →  6                   │
  │  • Full Body            →  6                   │
  │  Total                  →  50                  │
  └────────────────────────────────────────────────┘
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
