/**
 * FitTrack — Database Seed
 * Seeds 50 foundational exercises covering all major muscle groups.
 * Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // ─── CHEST — Pectoraux (8) ───────────────────────────────────────────────
  {
    name: "Développé couché barre",
    muscleGroup: "chest",
    equipment: "barbell",
    description:
      "Allongé sur le banc, saisir la barre à largeur d'épaules+. Descendre jusqu'à effleurer la poitrine, pousser en expirant. Garder les omoplates rétractées.",
  },
  {
    name: "Développé couché haltères",
    muscleGroup: "chest",
    equipment: "dumbbell",
    description:
      "Allongé sur le banc, haltères alignés aux pectoraux. Pousser vers le haut en rapprochant les haltères au sommet. Amplitude complète.",
  },
  {
    name: "Développé incliné barre",
    muscleGroup: "chest",
    equipment: "barbell",
    description:
      "Banc incliné à 30-45°. Même technique que le développé couché. Cible le faisceau supérieur des pectoraux.",
  },
  {
    name: "Écarté haltères",
    muscleGroup: "chest",
    equipment: "dumbbell",
    description:
      "Allongé sur le banc, bras tendus en croix. Descendre en arc de cercle jusqu'à l'étirement, remonter en contractant les pectoraux.",
  },
  {
    name: "Pompes",
    muscleGroup: "chest",
    equipment: "bodyweight",
    description:
      "En appui sur les mains et les orteils, corps gainé. Descendre jusqu'à effleurer le sol, pousser jusqu'à extension complète.",
  },
  {
    name: "Dips pectoraux",
    muscleGroup: "chest",
    equipment: "bodyweight",
    description:
      "Sur les barres parallèles, se pencher légèrement en avant. Descendre jusqu'à 90° aux coudes, remonter. Pencher le tronc pour cibler les pectoraux.",
  },
  {
    name: "Poulie croisée haute",
    muscleGroup: "chest",
    equipment: "cable",
    description:
      "Poulies en position haute, se positionner au centre. Croiser les mains devant soi en contractant les pectoraux. Mouvement en arc de cercle.",
  },
  {
    name: "Développé couché prise serrée",
    muscleGroup: "chest",
    equipment: "barbell",
    description:
      "Comme le développé couché mais prise à largeur d'épaules. Cible davantage les triceps et le faisceau interne des pectoraux.",
  },

  // ─── BACK — Dos (8) ──────────────────────────────────────────────────────
  {
    name: "Soulevé de terre",
    muscleGroup: "back",
    equipment: "barbell",
    description:
      "Pieds à largeur des hanches, barre au-dessus des pieds. Dos plat, hanches en arrière. Pousser le sol, hanches et épaules montent ensemble. Roi des exercices de dos.",
  },
  {
    name: "Tractions (Pull-ups)",
    muscleGroup: "back",
    equipment: "bodyweight",
    description:
      "Prise pronation à largeur d'épaules+. Partir bras tendus, tirer jusqu'au menton au-dessus de la barre. Contrôler la descente.",
  },
  {
    name: "Rowing barre (Bent-over row)",
    muscleGroup: "back",
    equipment: "barbell",
    description:
      "Dos penché à 45°, prise pronation. Tirer la barre vers le nombril en gardant les coudes proches. Contracter les dorsaux au sommet.",
  },
  {
    name: "Rowing haltère unilatéral",
    muscleGroup: "back",
    equipment: "dumbbell",
    description:
      "En appui sur un banc, tirer l'haltère vers la hanche. Amplitude maximale, rotation naturelle du tronc.",
  },
  {
    name: "Tirage vertical machine (Lat pulldown)",
    muscleGroup: "back",
    equipment: "machine",
    description:
      "Assis, prise large pronation. Tirer la barre vers le haut de la poitrine en rétractant les omoplates. Idéal pour les débutants.",
  },
  {
    name: "Tirage horizontal poulie",
    muscleGroup: "back",
    equipment: "cable",
    description:
      "Assis face à la poulie, tirer la poignée vers le nombril. Garder le dos droit, serrer les omoplates à l'arrivée.",
  },
  {
    name: "Good morning",
    muscleGroup: "back",
    equipment: "barbell",
    description:
      "Barre sur les trapèzes, jambes légèrement fléchies. Incliner le tronc jusqu'à l'horizontale en poussant les hanches en arrière. Stretching des ischio-jambiers.",
  },
  {
    name: "Shrugs barre",
    muscleGroup: "back",
    equipment: "barbell",
    description:
      "Barre en prise pronation, corps droit. Hausser les épaules vers les oreilles, maintenir 1s au sommet, descendre lentement. Cible les trapèzes.",
  },

  // ─── SHOULDERS — Épaules (6) ─────────────────────────────────────────────
  {
    name: "Développé militaire barre",
    muscleGroup: "shoulders",
    equipment: "barbell",
    description:
      "Debout ou assis, barre à hauteur d'épaules. Pousser verticalement jusqu'à extension complète. Rentrer légèrement les côtes, gainage abdominal.",
  },
  {
    name: "Développé militaire haltères",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    description:
      "Haltères à hauteur d'oreilles. Pousser verticalement en rapprochant légèrement les haltères au sommet. Amplitude et liberté de mouvement accrues.",
  },
  {
    name: "Élévations latérales haltères",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    description:
      "Bras le long du corps, légèrement fléchis. Lever jusqu'à l'horizontale, pincer légèrement le majeur vers le bas (comme pour verser un verre).",
  },
  {
    name: "Élévations frontales haltères",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    description:
      "Alternativement ou simultanément, lever les bras vers l'avant jusqu'à l'horizontale. Cible le faisceau antérieur du deltoïde.",
  },
  {
    name: "Face pull poulie",
    muscleGroup: "shoulders",
    equipment: "cable",
    description:
      "Poulie haute avec corde. Tirer vers le visage en écartant les mains. Cible les faisceaux postérieurs et les rotateurs externes.",
  },
  {
    name: "Rowing menton barre",
    muscleGroup: "shoulders",
    equipment: "barbell",
    description:
      "Prise pronation serrée. Tirer la barre vers le menton, coudes au-dessus des poignets. Cible les deltoïdes et les trapèzes.",
  },

  // ─── LEGS — Jambes (8) ───────────────────────────────────────────────────
  {
    name: "Squat barre (Back squat)",
    muscleGroup: "legs",
    equipment: "barbell",
    description:
      "Barre sur les trapèzes, pieds à largeur d'épaules. Descendre jusqu'à ce que les cuisses soient parallèles au sol. Garder le dos droit, pousser les genoux vers l'extérieur.",
  },
  {
    name: "Squat goblet haltère",
    muscleGroup: "legs",
    equipment: "dumbbell",
    description:
      "Tenir l'haltère à deux mains devant la poitrine. Descendre profondément en gardant le torse vertical. Excellent pour les débutants.",
  },
  {
    name: "Fente marchée haltères",
    muscleGroup: "legs",
    equipment: "dumbbell",
    description:
      "Avancer en fente, genou arrière frôlant le sol. Alterner les jambes. Travaille la coordination et l'équilibre en plus de la force.",
  },
  {
    name: "Leg press machine",
    muscleGroup: "legs",
    equipment: "machine",
    description:
      "Dos bien plaqué contre le dossier. Descendre jusqu'à 90° aux genoux, ne pas décoller les fessiers. Poussée explosive.",
  },
  {
    name: "Extension quadriceps machine",
    muscleGroup: "legs",
    equipment: "machine",
    description:
      "Assis, chevilles sous le rouleau. Étendre les jambes jusqu'à extension complète, contracter les quadriceps au sommet. Descente contrôlée.",
  },
  {
    name: "Curl ischio-jambiers machine",
    muscleGroup: "legs",
    equipment: "machine",
    description:
      "Allongé sur la machine, rouleau aux chevilles. Ramener les talons vers les fessiers. Isolation parfaite des ischio-jambiers.",
  },
  {
    name: "Mollets debout",
    muscleGroup: "legs",
    equipment: "machine",
    description:
      "Debout sur la machine, appuis sur les épaules. Monter sur la pointe des pieds, maintenir 1s, descendre sous l'horizontale pour l'étirement.",
  },
  {
    name: "Hip thrust barre",
    muscleGroup: "legs",
    equipment: "barbell",
    description:
      "Dos appuyé sur un banc, barre sur les hanches. Pousser les hanches vers le haut jusqu'à alignement corps. Contracter fort les fessiers au sommet.",
  },

  // ─── ARMS — Bras (8) ─────────────────────────────────────────────────────
  {
    name: "Curl biceps barre",
    muscleGroup: "arms",
    equipment: "barbell",
    description:
      "Prise supination, coudes collés au corps. Monter la barre jusqu'aux épaules, descendre lentement. Éviter le balancement du tronc.",
  },
  {
    name: "Curl biceps haltères",
    muscleGroup: "arms",
    equipment: "dumbbell",
    description:
      "Alternativement ou simultanément. Rotation du poignet en montant (supination). Amplitude complète.",
  },
  {
    name: "Curl marteau haltères",
    muscleGroup: "arms",
    equipment: "dumbbell",
    description:
      "Prise neutre (pouce vers le haut). Monte et descend sans rotation. Cible le brachial antérieur et le brachio-radial.",
  },
  {
    name: "Curl poulie basse",
    muscleGroup: "arms",
    equipment: "cable",
    description:
      "Poulie en position basse. Tension constante sur le biceps tout au long du mouvement. Excellent pour la congestion.",
  },
  {
    name: "Extension triceps poulie haute",
    muscleGroup: "arms",
    equipment: "cable",
    description:
      "Face à la poulie haute, coudes au corps. Étendre les bras vers le bas jusqu'à extension complète. Contracter les triceps.",
  },
  {
    name: "Dips triceps barre parallèles",
    muscleGroup: "arms",
    equipment: "bodyweight",
    description:
      "Corps vertical sur les barres parallèles. Descendre jusqu'à 90° aux coudes, remonter. Éviter le penché en avant pour isoler les triceps.",
  },
  {
    name: "Skullcrusher barre EZ",
    muscleGroup: "arms",
    equipment: "barbell",
    description:
      "Allongé sur le banc, barre EZ à bras tendus. Fléchir uniquement les coudes, descendre vers le front. Étirement maximal des triceps.",
  },
  {
    name: "Kickback triceps haltère",
    muscleGroup: "arms",
    equipment: "dumbbell",
    description:
      "Tronc penché à 90°, bras parallèle au corps. Étendre le bras jusqu'à la verticale. Contraction maximale des triceps en extension.",
  },

  // ─── CORE — Abdominaux (6) ───────────────────────────────────────────────
  {
    name: "Crunch",
    muscleGroup: "core",
    equipment: "bodyweight",
    description:
      "Allongé, genoux fléchis. Enrouler le tronc vers les genoux en contractant les abdominaux. Éviter de tirer sur la nuque.",
  },
  {
    name: "Planche (Plank)",
    muscleGroup: "core",
    equipment: "bodyweight",
    description:
      "En appui sur les coudes et les orteils. Corps aligné de la tête aux talons, gainage total. Respirer normalement.",
  },
  {
    name: "Crunch bicycle",
    muscleGroup: "core",
    equipment: "bodyweight",
    description:
      "Alterner coude droit vers genou gauche et inversement. Mouvement de pédalage. Cible les obliques et le droit de l'abdomen.",
  },
  {
    name: "Relevé de jambes suspendu",
    muscleGroup: "core",
    equipment: "bodyweight",
    description:
      "Suspendu à une barre fixe. Lever les jambes tendues jusqu'à l'horizontale ou plus. Contrôle total de la descente.",
  },
  {
    name: "Russian twist",
    muscleGroup: "core",
    equipment: "bodyweight",
    description:
      "Assis, dos incliné à 45°, pieds décollés. Rotation du tronc alternativement gauche/droite. Peut être alourdissant avec un disque.",
  },
  {
    name: "Gainage latéral",
    muscleGroup: "core",
    equipment: "bodyweight",
    description:
      "En appui sur un coude et le bord du pied. Corps aligné. Maintien isométrique. Cible les obliques.",
  },

  // ─── FULL BODY — Polyarticulaires (6) ────────────────────────────────────
  {
    name: "Burpees",
    muscleGroup: "full_body",
    equipment: "bodyweight",
    description:
      "Debout, s'abaisser, sauter en pompe, remonter et sauter verticalement avec les bras levés. Exercice de conditionnement cardiovasculaire total.",
  },
  {
    name: "Kettlebell swing",
    muscleGroup: "full_body",
    equipment: "kettlebell",
    description:
      "Pieds à largeur d'épaules, kettlebell entre les pieds. Projection explosive des hanches, laisser le kettlebell monter jusqu'à l'horizontale. Mouvement de charnière, pas de squat.",
  },
  {
    name: "Thruster haltères",
    muscleGroup: "full_body",
    equipment: "dumbbell",
    description:
      "Enchaîner un squat frontale et un développé militaire en un seul mouvement fluide. Excellent pour la condition physique générale.",
  },
  {
    name: "Soulevé de terre roumain",
    muscleGroup: "full_body",
    equipment: "barbell",
    description:
      "Comme le soulevé de terre classique mais jambes quasi-tendues. Descente avec poussée des hanches en arrière. Étirement fort des ischio-jambiers.",
  },
  {
    name: "Propulsion (Push press)",
    muscleGroup: "full_body",
    equipment: "barbell",
    description:
      "Légère flexion des jambes puis extension explosive pour propulser la barre. Transfert de force des jambes vers les épaules. Variante dynamique du développé militaire.",
  },
  {
    name: "Arraché haltère",
    muscleGroup: "full_body",
    equipment: "dumbbell",
    description:
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
  ┌─────────────────────────────────┐
  │  Exercises by muscle group:     │
  │  • Chest (Pectoraux)    →  8    │
  │  • Back (Dos)           →  8    │
  │  • Shoulders (Épaules)  →  6    │
  │  • Legs (Jambes)        →  8    │
  │  • Arms (Bras)          →  8    │
  │  • Core (Abdos)         →  6    │
  │  • Full Body            →  6    │
  │  Total                  → 50    │
  └─────────────────────────────────┘
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
