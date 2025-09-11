/**
 * Progression and Validation System for The Midnight Express Mystery
 * Handles puzzle validation, progression tracking, and hint system
 */

export interface PuzzleValidation {
  puzzleId: string;
  sceneId: string;
  validationType: 'exact_match' | 'fuzzy_match' | 'multiple_choice' | 'custom_logic';
  correctAnswers: string[];
  alternativeAnswers?: string[];
  validationLogic?: string;
  caseSensitive: boolean;
  allowPartialCredit: boolean;
  partialCreditThreshold: number;
}

export interface ProgressionTracker {
  sceneId: string;
  puzzleId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  timeSpent: number;
  hintsUsed: number;
  score: number;
  completedAt?: Date;
  unlockedBy?: string[];
}

export interface HintSystem {
  hintId: string;
  puzzleId: string;
  level: 'subtle' | 'obvious' | 'direct';
  text: string;
  unlockCondition: string;
  cost: number;
  cooldown: number;
}

export interface SceneUnlockCondition {
  sceneId: string;
  requiredScenes: string[];
  requiredPuzzles: string[];
  requiredDecisions?: string[];
  timeGate?: number;
  teamConsensus?: boolean;
}

export const midnightExpressValidations: PuzzleValidation[] = [
  {
    puzzleId: 'puzzle-1-manifest',
    sceneId: 'scene-1-embarkation',
    validationType: 'exact_match',
    correctAnswers: ['3A', '3a'],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-2-servilleta',
    sceneId: 'scene-2-dining-car',
    validationType: 'fuzzy_match',
    correctAnswers: [
      'REUNIÓN A MEDIANOCHE EN EL COCHE DE EQUIPAJE',
      'REUNION A MEDIANOCHE EN EL COCHE DE EQUIPAJE',
      'reunión a medianoche en el coche de equipaje'
    ],
    caseSensitive: false,
    allowPartialCredit: true,
    partialCreditThreshold: 0.8
  },
  {
    puzzleId: 'puzzle-2-morse',
    sceneId: 'scene-2-dining-car',
    validationType: 'exact_match',
    correctAnswers: [
      'VENTANA DEL COMEDOR',
      'ventana del comedor',
      'Ventana del comedor'
    ],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-3-luggage',
    sceneId: 'scene-3-lounge',
    validationType: 'exact_match',
    correctAnswers: ['BEE', 'bee', 'Bee'],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-4-weights',
    sceneId: 'scene-4-cabin-3a',
    validationType: 'exact_match',
    correctAnswers: [
      'IV,I,II,III',
      'IV, I, II, III',
      'iv,i,ii,iii'
    ],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-5-gramophone',
    sceneId: 'scene-5-observation',
    validationType: 'fuzzy_match',
    correctAnswers: [
      'ARTEFACTO EN EQUIPAJE',
      'artefacto en equipaje',
      'ARTEFACTO EN EQUIPAGE'
    ],
    caseSensitive: false,
    allowPartialCredit: true,
    partialCreditThreshold: 0.9
  },
  {
    puzzleId: 'puzzle-5-jean-riddle',
    sceneId: 'scene-5-observation',
    validationType: 'exact_match',
    correctAnswers: [
      '2,3,5',
      '2, 3, 5',
      '2-3-5'
    ],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-6-luggage-search',
    sceneId: 'scene-6-luggage-car',
    validationType: 'exact_match',
    correctAnswers: [
      '5,7,6',
      '5, 7, 6',
      '5-7-6'
    ],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-6-invisible-ink',
    sceneId: 'scene-6-luggage-car',
    validationType: 'fuzzy_match',
    correctAnswers: [
      'PRESIONAR LA TABLA',
      'presionar la tabla',
      'PRESIONAR TABLA',
      'empujar la tabla'
    ],
    caseSensitive: false,
    allowPartialCredit: true,
    partialCreditThreshold: 0.8
  },
  {
    puzzleId: 'puzzle-7-access-code',
    sceneId: 'scene-7-engine-room',
    validationType: 'exact_match',
    correctAnswers: ['042', '42'],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-7-cable-connection',
    sceneId: 'scene-7-engine-room',
    validationType: 'fuzzy_match',
    correctAnswers: [
      'Rojo→C, Azul→B, Verde→A',
      'rojo→c, azul→b, verde→a',
      'Rojo-C, Azul-B, Verde-A'
    ],
    caseSensitive: false,
    allowPartialCredit: true,
    partialCreditThreshold: 0.9
  },
  {
    puzzleId: 'puzzle-8-logic-grid',
    sceneId: 'scene-8-library',
    validationType: 'exact_match',
    correctAnswers: ['ARIA', 'aria', 'Aria'],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-8-interrogation',
    sceneId: 'scene-8-library',
    validationType: 'exact_match',
    correctAnswers: ['TRAICIÓN', 'traición', 'TRAICION'],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-9-gears',
    sceneId: 'scene-9-hidden-car',
    validationType: 'exact_match',
    correctAnswers: [
      '☀,★,☾,▲,◆',
      'sol,estrella,luna,triangulo,diamante'
    ],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  },
  {
    puzzleId: 'puzzle-10-telegram',
    sceneId: 'scene-10-conclusion',
    validationType: 'exact_match',
    correctAnswers: ['EVIDENCIA', 'evidencia', 'Evidencia'],
    caseSensitive: false,
    allowPartialCredit: false,
    partialCreditThreshold: 0
  }
];

export const midnightExpressHints: HintSystem[] = [
  // Scene 1 - Manifest
  {
    hintId: 'hint-1-manifest-subtle',
    puzzleId: 'puzzle-1-manifest',
    level: 'subtle',
    text: 'Recuerda que las cabinas están numeradas en orden: 1A, 1C, 2A, 2B, 3A, 3B',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-1-manifest-obvious',
    puzzleId: 'puzzle-1-manifest',
    level: 'obvious',
    text: 'Las iniciales de los segundos apellidos son: R, F, S, L, B, Á. ¿Puedes formar un número de cabina?',
    unlockCondition: 'second_attempt',
    cost: 10,
    cooldown: 60
  },
  {
    hintId: 'hint-1-manifest-direct',
    puzzleId: 'puzzle-1-manifest',
    level: 'direct',
    text: 'Las letras R, F, S, L, B, Á forman un anagrama de "3A" (usando B como 3 y Á como A)',
    unlockCondition: 'third_attempt',
    cost: 25,
    cooldown: 120
  },

  // Scene 2 - Servilleta
  {
    hintId: 'hint-2-servilleta-subtle',
    puzzleId: 'puzzle-2-servilleta',
    level: 'subtle',
    text: 'Una cuadrícula 5x9 tiene 45 espacios, y tienes 45 letras. ¿Coincidencia?',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-2-servilleta-obvious',
    puzzleId: 'puzzle-2-servilleta',
    level: 'obvious',
    text: 'Escribe las letras horizontalmente en la cuadrícula, luego lee verticalmente por columnas',
    unlockCondition: 'second_attempt',
    cost: 15,
    cooldown: 90
  },
  {
    hintId: 'hint-2-servilleta-direct',
    puzzleId: 'puzzle-2-servilleta',
    level: 'direct',
    text: 'El mensaje dice: "REUNIÓN A MEDIANOCHE EN EL COCHE DE EQUIPAJE"',
    unlockCondition: 'third_attempt',
    cost: 30,
    cooldown: 180
  },

  // Scene 2 - Morse
  {
    hintId: 'hint-2-morse-subtle',
    puzzleId: 'puzzle-2-morse',
    level: 'subtle',
    text: 'El código Morse usa puntos (.) y rayas (-). La secuencia está separada por espacios',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-2-morse-obvious',
    puzzleId: 'puzzle-2-morse',
    level: 'obvious',
    text: 'Usa la tabla de Morse: ...- = V, . = E, -. = N, etc.',
    unlockCondition: 'second_attempt',
    cost: 10,
    cooldown: 60
  },
  {
    hintId: 'hint-2-morse-direct',
    puzzleId: 'puzzle-2-morse',
    level: 'direct',
    text: 'El mensaje en Morse dice: "VENTANA DEL COMEDOR"',
    unlockCondition: 'third_attempt',
    cost: 20,
    cooldown: 120
  },

  // Scene 3 - Luggage
  {
    hintId: 'hint-3-luggage-subtle',
    puzzleId: 'puzzle-3-luggage',
    level: 'subtle',
    text: 'Calcula las diferencias de tiempo entre paradas consecutivas',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-3-luggage-obvious',
    puzzleId: 'puzzle-3-luggage',
    level: 'obvious',
    text: 'París→Lyon: 2h, Lyon→Marsella: 5h, Marsella→Milán: 5h, Milán→Venecia: 9h',
    unlockCondition: 'second_attempt',
    cost: 15,
    cooldown: 90
  },
  {
    hintId: 'hint-3-luggage-direct',
    puzzleId: 'puzzle-3-luggage',
    level: 'direct',
    text: 'Las primeras tres diferencias son 2, 5, 5. En el alfabeto: B, E, E',
    unlockCondition: 'third_attempt',
    cost: 25,
    cooldown: 150
  },

  // Scene 4 - Weights
  {
    hintId: 'hint-4-weights-subtle',
    puzzleId: 'puzzle-4-weights',
    level: 'subtle',
    text: 'Ordena los objetos de menor a mayor peso',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-4-weights-obvious',
    puzzleId: 'puzzle-4-weights',
    level: 'obvious',
    text: 'Los pesos son: 200g, 300g, 500g, 800g. ¿Cuál es el orden?',
    unlockCondition: 'second_attempt',
    cost: 10,
    cooldown: 60
  },
  {
    hintId: 'hint-4-weights-direct',
    puzzleId: 'puzzle-4-weights',
    level: 'direct',
    text: 'El orden correcto es: IV (200g), I (300g), II (500g), III (800g)',
    unlockCondition: 'third_attempt',
    cost: 20,
    cooldown: 120
  },

  // Scene 5 - Gramophone
  {
    hintId: 'hint-5-gramophone-subtle',
    puzzleId: 'puzzle-5-gramophone',
    level: 'subtle',
    text: 'Los números en el disco indican el orden de los golpes en Morse',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-5-gramophone-obvious',
    puzzleId: 'puzzle-5-gramophone',
    level: 'obvious',
    text: 'Convierte cada golpe a Morse: 1=golpe corto, 2=golpe largo, etc.',
    unlockCondition: 'second_attempt',
    cost: 20,
    cooldown: 120
  },
  {
    hintId: 'hint-5-gramophone-direct',
    puzzleId: 'puzzle-5-gramophone',
    level: 'direct',
    text: 'El mensaje en Morse dice: "ARTEFACTO EN EQUIPAJE"',
    unlockCondition: 'third_attempt',
    cost: 35,
    cooldown: 180
  },

  // Scene 5 - Jean's Riddle
  {
    hintId: 'hint-5-riddle-subtle',
    puzzleId: 'puzzle-5-jean-riddle',
    level: 'subtle',
    text: '420 ÷ 42 = 10. Busca tres números consecutivos que sumen 10',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-5-riddle-obvious',
    puzzleId: 'puzzle-5-jean-riddle',
    level: 'obvious',
    text: 'Si x + (x+1) + (x+2) = 10, entonces 3x + 3 = 10, así que x = 7/3...',
    unlockCondition: 'second_attempt',
    cost: 15,
    cooldown: 90
  },
  {
    hintId: 'hint-5-riddle-direct',
    puzzleId: 'puzzle-5-jean-riddle',
    level: 'direct',
    text: 'Los números son 2, 3, 5 (aunque no son estrictamente consecutivos)',
    unlockCondition: 'third_attempt',
    cost: 25,
    cooldown: 150
  },

  // Scene 6 - Luggage Search
  {
    hintId: 'hint-6-search-subtle',
    puzzleId: 'puzzle-6-luggage-search',
    level: 'subtle',
    text: 'Busca: rojo impar, azul primo, verde múltiplo de 3',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-6-search-obvious',
    puzzleId: 'puzzle-6-luggage-search',
    level: 'obvious',
    text: 'Rojo 5 (impar), Azul 7 (primo), Verde 6 (múltiplo de 3)',
    unlockCondition: 'second_attempt',
    cost: 15,
    cooldown: 90
  },
  {
    hintId: 'hint-6-search-direct',
    puzzleId: 'puzzle-6-luggage-search',
    level: 'direct',
    text: 'El orden correcto es: 5, 7, 6',
    unlockCondition: 'third_attempt',
    cost: 25,
    cooldown: 150
  },

  // Scene 7 - Access Code
  {
    hintId: 'hint-7-code-subtle',
    puzzleId: 'puzzle-7-access-code',
    level: 'subtle',
    text: 'Suma los dígitos del número de serie: 7+4+2+1',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-7-code-obvious',
    puzzleId: 'puzzle-7-access-code',
    level: 'obvious',
    text: '7+4+2+1 = 14, luego 14 × 3 = 42',
    unlockCondition: 'second_attempt',
    cost: 10,
    cooldown: 60
  },
  {
    hintId: 'hint-7-code-direct',
    puzzleId: 'puzzle-7-access-code',
    level: 'direct',
    text: 'El código es 042 (formato de 3 dígitos)',
    unlockCondition: 'third_attempt',
    cost: 20,
    cooldown: 120
  },

  // Scene 8 - Logic Grid
  {
    hintId: 'hint-8-logic-subtle',
    puzzleId: 'puzzle-8-logic-grid',
    level: 'subtle',
    text: 'Crea una tabla con horarios y ubicaciones para cada personaje',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-8-logic-obvious',
    puzzleId: 'puzzle-8-logic-grid',
    level: 'obvious',
    text: 'Aria estaba paseando a las 22:00, luego cenó, luego se reunió a las 23:00',
    unlockCondition: 'second_attempt',
    cost: 20,
    cooldown: 120
  },
  {
    hintId: 'hint-8-logic-direct',
    puzzleId: 'puzzle-8-logic-grid',
    level: 'direct',
    text: 'Aria se reunió con el doctor a las 23:00 en el coche de equipaje',
    unlockCondition: 'third_attempt',
    cost: 35,
    cooldown: 180
  },

  // Scene 10 - Telegram
  {
    hintId: 'hint-10-telegram-subtle',
    puzzleId: 'puzzle-10-telegram',
    level: 'subtle',
    text: 'Reordena las letras E, V, I, D, E, N, C, I, A para formar una palabra',
    unlockCondition: 'first_attempt',
    cost: 0,
    cooldown: 0
  },
  {
    hintId: 'hint-10-telegram-obvious',
    puzzleId: 'puzzle-10-telegram',
    level: 'obvious',
    text: 'La palabra está relacionada con pruebas o pruebas de un crimen',
    unlockCondition: 'second_attempt',
    cost: 15,
    cooldown: 90
  },
  {
    hintId: 'hint-10-telegram-direct',
    puzzleId: 'puzzle-10-telegram',
    level: 'direct',
    text: 'La palabra es EVIDENCIA',
    unlockCondition: 'third_attempt',
    cost: 25,
    cooldown: 150
  }
];

export const midnightExpressUnlockConditions: SceneUnlockCondition[] = [
  {
    sceneId: 'scene-2-dining-car',
    requiredScenes: ['scene-1-embarkation'],
    requiredPuzzles: ['puzzle-1-manifest']
  },
  {
    sceneId: 'scene-3-lounge',
    requiredScenes: ['scene-2-dining-car'],
    requiredPuzzles: ['puzzle-2-servilleta', 'puzzle-2-morse']
  },
  {
    sceneId: 'scene-4-cabin-3a',
    requiredScenes: ['scene-3-lounge'],
    requiredPuzzles: ['puzzle-3-luggage']
  },
  {
    sceneId: 'scene-5-observation',
    requiredScenes: ['scene-4-cabin-3a'],
    requiredPuzzles: ['puzzle-4-weights']
  },
  {
    sceneId: 'scene-6-luggage-car',
    requiredScenes: ['scene-5-observation'],
    requiredPuzzles: ['puzzle-5-gramophone', 'puzzle-5-jean-riddle']
  },
  {
    sceneId: 'scene-7-engine-room',
    requiredScenes: ['scene-6-luggage-car'],
    requiredPuzzles: ['puzzle-6-luggage-search', 'puzzle-6-invisible-ink']
  },
  {
    sceneId: 'scene-8-library',
    requiredScenes: ['scene-7-engine-room'],
    requiredPuzzles: ['puzzle-7-access-code', 'puzzle-7-cable-connection']
  },
  {
    sceneId: 'scene-9-hidden-car',
    requiredScenes: ['scene-8-library'],
    requiredPuzzles: ['puzzle-8-logic-grid', 'puzzle-8-interrogation']
  },
  {
    sceneId: 'scene-10-conclusion',
    requiredScenes: ['scene-9-hidden-car'],
    requiredPuzzles: ['puzzle-9-gears']
  }
];

export default {
  validations: midnightExpressValidations,
  hints: midnightExpressHints,
  unlockConditions: midnightExpressUnlockConditions
};
