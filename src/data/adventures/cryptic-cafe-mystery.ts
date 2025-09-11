/**
 * The Cryptic Café Mystery - Adventure Data
 * A mystery adventure set in a local coffee shop with coded messages
 * Duration: 40 minutes, Players: 2-6, Age: 8+, Difficulty: Easy
 */

import { Adventure, Scene, Challenge, Role, AdventureCategory, DifficultyLevel, ChallengeType, InteractionType } from '@/lib/domain/adventure/models'

export const crypticCafeMystery: Adventure = {
  id: 'cryptic-cafe-mystery',
  organizationId: 'cluequest-org',
  creatorId: 'system',
  
  // Basic Properties
  title: 'The Cryptic Café',
  description: 'A local coffee shop has become the center of a conspiracy. Decode the secret messages and uncover the truth before the café\'s reputation is ruined.',
  category: AdventureCategory.ENTERTAINMENT,
  difficulty: DifficultyLevel.BEGINNER,
  estimatedDuration: 40, // minutes
  
  // Experience Configuration
  settings: {
    allowTeams: true,
    maxTeamSize: 6,
    allowIndividualPlay: true,
    linearProgression: true,
    allowBacktracking: true,
    saveProgressEnabled: true,
    liveLeaderboard: true,
    realTimeHints: true,
    teamChat: true,
    aiPersonalization: false,
    adaptiveDifficulty: false,
    dynamicNarrative: false,
    strictGeolocation: false,
    deviceFingerprinting: true,
    antiCheatMeasures: {
      timeThresholds: {
        minSceneTime: 20,
        maxSceneTime: 2400,
        suspiciousFastCompletion: 30,
      },
      behaviorAnalysis: {
        trackMouseMovements: false,
        trackKeystrokes: false,
        detectAutomation: true,
      },
      fraudDetection: {
        duplicateDeviceDetection: true,
        vpnDetection: false,
        locationSpoofingDetection: false,
      },
    },
  },
  
  scenes: [
    {
      id: 'scene-1-specials-board',
      orderIndex: 1,
      title: 'Tabla de Especiales - El mensaje oculto',
      description: 'Los jugadores entran en el café y ven un pizarrón que anuncia las "Especialidades del Día". Un cliente comenta que recibió un mensaje secreto en su pedido.',
      narrative: 'Bienvenidos a "Bean & Code", el café local que se ha vuelto famoso por sus deliciosas bebidas artesanales... y por los mensajes misteriosos que algunos clientes encuentran en sus pedidos. Los rumores apuntan a que un grupo de baristas activistas está aprovechando los pedidos para intercambiar información secreta. Tienen 40 minutos para seguir la pista de estos mensajes y desvelar quién está detrás de la conspiración.',
      interactionType: InteractionType.PUZZLE,
      completionCriteria: {
        type: 'puzzle_solve',
        puzzleId: 'acrostic-specials',
        requiredSolution: 'SECRET'
      },
      unlockConditions: [],
      timeLimit: 300, // 5 minutes
      maxAttempts: 3,
      hintCost: 10,
      pointsReward: 100,
      requiresTeam: false,
      teamSizeRequired: 1,
      simultaneousAccess: true,
      branchingConditions: [],
      failureAction: 'retry',
      adaptiveHints: false,
      aiValidation: false,
      challenges: [
        {
          id: 'acrostic-specials',
          title: 'Acróstico de Especialidades',
          description: 'Observa la primera letra de cada bebida en la tabla de especialidades. ¿Forman alguna palabra?',
          type: ChallengeType.LOGIC,
          difficulty: DifficultyLevel.BEGINNER,
          timeLimit: 300,
          maxAttempts: 3,
          pointsReward: 100,
          hints: [
            {
              level: 1,
              text: 'Mira la primera letra de cada bebida en orden',
              cost: 10
            },
            {
              level: 2,
              text: 'S-Strawberry, E-Espresso, C-Cappuccino...',
              cost: 20
            },
            {
              level: 3,
              text: 'Las iniciales forman la palabra SECRET',
              cost: 30
            }
          ],
          solution: {
            type: 'text',
            value: 'SECRET',
            explanation: 'Las iniciales de Strawberry Smoothie, Espresso, Cappuccino, Red Eye, Earl Grey Tea, Turkish Coffee forman la palabra SECRET'
          },
          materials: [
            'Pizarrón de madera con nombres de bebidas',
            'Nota adhesiva',
            'Marcador'
          ]
        }
      ]
    },
    {
      id: 'scene-2-coffee-sacks',
      orderIndex: 2,
      title: 'Sacos de granos - Código numérico',
      description: 'Los jugadores descubren seis pequeños sacos etiquetados con orígenes de café. Dentro de cada saco hay un número diferente de granos.',
      narrative: 'Detrás del pizarrón hay un pequeño compartimento. Al abrirlo, los jugadores encuentran una nota que dice: "Cuenta los granos y hallarás la clave". Ahora deben examinar los sacos de café para continuar.',
      interactionType: InteractionType.PUZZLE,
      completionCriteria: {
        type: 'puzzle_solve',
        puzzleId: 'grain-count-cipher',
        requiredSolution: 'COFFEE'
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          sceneId: 'scene-1-specials-board'
        }
      ],
      timeLimit: 400, // 6.5 minutes
      maxAttempts: 3,
      hintCost: 15,
      pointsReward: 120,
      requiresTeam: false,
      teamSizeRequired: 1,
      simultaneousAccess: true,
      branchingConditions: [],
      failureAction: 'retry',
      adaptiveHints: false,
      aiValidation: false,
      challenges: [
        {
          id: 'grain-count-cipher',
          title: 'Conteo de granos y conversión a letras',
          description: 'Cuenta los granos de cada saco y usa el código A=1, B=2, etc., para convertirlos en letras.',
          type: ChallengeType.MATHEMATICAL,
          difficulty: DifficultyLevel.BEGINNER,
          timeLimit: 400,
          maxAttempts: 3,
          pointsReward: 120,
          hints: [
            {
              level: 1,
              text: 'Cuenta cuidadosamente los granos en cada saco',
              cost: 15
            },
            {
              level: 2,
              text: 'Brasil=3, Etiopía=15, Colombia=6, Kenia=6, Sumatra=5, Guatemala=5',
              cost: 25
            },
            {
              level: 3,
              text: 'Convierte a letras: 3=C, 15=O, 6=F, 6=F, 5=E, 5=E = COFFEE',
              cost: 35
            }
          ],
          solution: {
            type: 'text',
            value: 'COFFEE',
            explanation: 'Los números 3-15-6-6-5-5 se convierten en las letras C-O-F-F-E-E, formando la palabra COFFEE'
          },
          materials: [
            'Seis sacos de mini grano',
            'Tarjeta con el alfabeto A1Z26',
            'Papel y lápiz'
          ]
        }
      ]
    },
    {
      id: 'scene-3-sugar-jar',
      orderIndex: 3,
      title: 'Tarro de azúcar - Poema en acróstico',
      description: 'Detrás del mostrador hay un tarro con sobres de azúcar. Al abrirlo, los jugadores encuentran un pergamino con un poema de cuatro líneas.',
      narrative: 'Una nota dentro del saco de Guatemala confirma: "Muy bien, amantes del café. Ahora busquen donde el dulce se esconde". Los jugadores deben examinar el tarro de azúcar.',
      interactionType: InteractionType.PUZZLE,
      completionCriteria: {
        type: 'puzzle_solve',
        puzzleId: 'poem-acrostic',
        requiredSolution: 'FOAM'
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          sceneId: 'scene-2-coffee-sacks'
        }
      ],
      timeLimit: 350, // 5.8 minutes
      maxAttempts: 3,
      hintCost: 12,
      pointsReward: 110,
      requiresTeam: false,
      teamSizeRequired: 1,
      simultaneousAccess: true,
      branchingConditions: [],
      failureAction: 'retry',
      adaptiveHints: false,
      aiValidation: false,
      challenges: [
        {
          id: 'poem-acrostic',
          title: 'Poema en acróstico',
          description: 'Observa la primera letra de cada línea del poema. ¿Qué palabra forman?',
          type: ChallengeType.LINGUISTIC,
          difficulty: DifficultyLevel.BEGINNER,
          timeLimit: 350,
          maxAttempts: 3,
          pointsReward: 110,
          hints: [
            {
              level: 1,
              text: 'Lee cada línea del poema cuidadosamente',
              cost: 12
            },
            {
              level: 2,
              text: 'F-rom dawn, O-ur foamy, A-mongst the, M-ilk coffee',
              cost: 22
            },
            {
              level: 3,
              text: 'Las primeras letras forman FOAM',
              cost: 32
            }
          ],
          solution: {
            type: 'text',
            value: 'FOAM',
            explanation: 'Las primeras letras de cada línea forman FOAM: From dawn, Our foamy, Amongst the, Milk coffee'
          },
          materials: [
            'Tarro con sobres de azúcar',
            'Pergamino con poema',
            'Lámpara de lectura'
          ]
        }
      ]
    },
    {
      id: 'scene-4-latte-art',
      orderIndex: 4,
      title: 'Arte latte - Reconocimiento de patrones',
      description: 'En la barra hay fotos de seis tazas con diferentes diseños de arte latte. Junto a las fotos, hay una tarjeta con un código que asigna una letra a cada patrón.',
      narrative: 'La pista indica que la respuesta está en el arte del café (espuma). Los jugadores deben examinar las tazas de café en la barra para continuar.',
      interactionType: InteractionType.PUZZLE,
      completionCriteria: {
        type: 'puzzle_solve',
        puzzleId: 'latte-pattern-sequence',
        requiredSolution: 'INMA'
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          sceneId: 'scene-3-sugar-jar'
        }
      ],
      timeLimit: 380, // 6.3 minutes
      maxAttempts: 3,
      hintCost: 18,
      pointsReward: 130,
      requiresTeam: false,
      teamSizeRequired: 1,
      simultaneousAccess: true,
      branchingConditions: [],
      failureAction: 'retry',
      adaptiveHints: false,
      aiValidation: false,
      challenges: [
        {
          id: 'latte-pattern-sequence',
          title: 'Secuencia de patrones de arte latte',
          description: 'Usando la correspondencia, convierte la secuencia de patrones en letras y forma una palabra.',
          type: ChallengeType.SPATIAL,
          difficulty: DifficultyLevel.BEGINNER,
          timeLimit: 380,
          maxAttempts: 3,
          pointsReward: 130,
          hints: [
            {
              level: 1,
              text: 'Observa la correspondencia patrón-letra en la tarjeta',
              cost: 18
            },
            {
              level: 2,
              text: 'Rosetta=I, Ola=N, Corazón=M, Tulipán=A',
              cost: 28
            },
            {
              level: 3,
              text: 'La secuencia forma la palabra INMA',
              cost: 38
            }
          ],
          solution: {
            type: 'text',
            value: 'INMA',
            explanation: 'Rosetta (I), Ola (N), Corazón (M), Tulipán (A) forman la palabra INMA, abreviación de "INventario de MAteriales"'
          },
          materials: [
            'Seis fotos de arte latte',
            'Tarjeta de correspondencia patrón-letra',
            'Papel para anotaciones'
          ]
        }
      ]
    },
    {
      id: 'scene-5-storage-room',
      orderIndex: 5,
      title: 'Cuarto de almacenamiento - Colores y pesos',
      description: 'En el cuarto de almacenamiento hay estantes con sobres de azúcar de diferentes colores y una báscula. Una nota indica el orden correcto.',
      narrative: 'El personal del café explica que "INMA" es el nombre abreviado de "INventario de MAteriales". Esto sugiere revisar el cuarto de almacenamiento.',
      interactionType: InteractionType.PUZZLE,
      completionCriteria: {
        type: 'puzzle_solve',
        puzzleId: 'color-weight-combination',
        requiredSolution: '2431'
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          sceneId: 'scene-4-latte-art'
        }
      ],
      timeLimit: 420, // 7 minutes
      maxAttempts: 3,
      hintCost: 20,
      pointsReward: 140,
      requiresTeam: false,
      teamSizeRequired: 1,
      simultaneousAccess: true,
      branchingConditions: [],
      failureAction: 'retry',
      adaptiveHints: false,
      aiValidation: false,
      challenges: [
        {
          id: 'color-weight-combination',
          title: 'Combinación de colores y pesos',
          description: 'Ordena los sobres por peso ascendente y usa la primera letra de cada color como código.',
          type: ChallengeType.PHYSICAL,
          difficulty: DifficultyLevel.BEGINNER,
          timeLimit: 420,
          maxAttempts: 3,
          pointsReward: 140,
          hints: [
            {
              level: 1,
              text: 'Usa la báscula para pesar cada sobre',
              cost: 20
            },
            {
              level: 2,
              text: 'Orden ascendente: Azul(10g), Verde(12g), Amarillo(20g), Rojo(25g)',
              cost: 30
            },
            {
              level: 3,
              text: 'AVAR = 2-4-3-1 según el panel de colores',
              cost: 40
            }
          ],
          solution: {
            type: 'numeric',
            value: '2431',
            explanation: 'El orden ascendente es Azul(A), Verde(V), Amarillo(A), Rojo(R). Usando el panel de colores: Azul=2, Verde=4, Amarillo=3, Rojo=1'
          },
          materials: [
            'Sobres de azúcar de distintos colores y pesos',
            'Báscula',
            'Candado numérico',
            'Panel de colores'
          ]
        }
      ]
    },
    {
      id: 'scene-6-roasting-room',
      orderIndex: 6,
      title: 'Sala de tostado - Aromas y números',
      description: 'Los jugadores entran en la sala donde se tuestan los granos. Hay cinco frascos etiquetados con especias y un cartel con instrucciones.',
      narrative: 'Al introducir 2431, el candado se abre y revela una nota que dice: "Buen trabajo. Ahora sigue tu nariz al tostador".',
      interactionType: InteractionType.SENSORY,
      completionCriteria: {
        type: 'puzzle_solve',
        puzzleId: 'aroma-ranking',
        requiredSolution: '24513'
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          sceneId: 'scene-5-storage-room'
        }
      ],
      timeLimit: 450, // 7.5 minutes
      maxAttempts: 3,
      hintCost: 25,
      pointsReward: 150,
      requiresTeam: false,
      teamSizeRequired: 1,
      simultaneousAccess: true,
      branchingConditions: [],
      failureAction: 'retry',
      adaptiveHints: false,
      aiValidation: false,
      challenges: [
        {
          id: 'aroma-ranking',
          title: 'Ranking de aromas por intensidad',
          description: 'Huele cada frasco y ordénalos de más fuerte a más suave según su intensidad aromática.',
          type: ChallengeType.SENSORY,
          difficulty: DifficultyLevel.BEGINNER,
          timeLimit: 450,
          maxAttempts: 3,
          pointsReward: 150,
          hints: [
            {
              level: 1,
              text: 'Huele cada frasco cuidadosamente y compara intensidades',
              cost: 25
            },
            {
              level: 2,
              text: 'Orden sugerido: Cacao(1), Canela(2), Nuez moscada(3), Cardamomo(4), Vainilla(5)',
              cost: 35
            },
            {
              level: 3,
              text: 'La secuencia es 2-4-5-1-3',
              cost: 45
            }
          ],
          solution: {
            type: 'numeric',
            value: '24513',
            explanation: 'Orden de más fuerte a más suave: Canela(2), Cardamomo(4), Vainilla(5), Cacao(1), Nuez moscada(3)'
          },
          materials: [
            'Cinco frascos con aromas',
            'Fichas numeradas',
            'Caja fuerte con cerradura de 5 dígitos'
          ]
        }
      ]
    },
    {
      id: 'scene-7-loyalty-cards',
      orderIndex: 7,
      title: 'Tarjetas perforadas - Mensaje final',
      description: 'Las tarjetas de fidelidad tienen agujeros en distintas posiciones. Individualmente, parecen aleatorias, pero al superponerlas se forman letras.',
      narrative: 'La caja fuerte se abre y contiene un conjunto de tres cartas perforadas (tarjetas de fidelidad) y una nota que dice: "Superpuesto, el mensaje se ve".',
      interactionType: InteractionType.PUZZLE,
      completionCriteria: {
        type: 'puzzle_solve',
        puzzleId: 'overlay-message',
        requiredSolution: 'BARISTA'
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          sceneId: 'scene-6-roasting-room'
        }
      ],
      timeLimit: 500, // 8.3 minutes
      maxAttempts: 3,
      hintCost: 30,
      pointsReward: 200,
      requiresTeam: false,
      teamSizeRequired: 1,
      simultaneousAccess: true,
      branchingConditions: [],
      failureAction: 'retry',
      adaptiveHints: false,
      aiValidation: false,
      challenges: [
        {
          id: 'overlay-message',
          title: 'Mensaje superpuesto en tarjetas',
          description: 'Coloca las tres tarjetas una encima de otra y alinéalas siguiendo las líneas impresas.',
          type: ChallengeType.SPATIAL,
          difficulty: DifficultyLevel.BEGINNER,
          timeLimit: 500,
          maxAttempts: 3,
          pointsReward: 200,
          hints: [
            {
              level: 1,
              text: 'Superpón las tarjetas y alinéalas cuidadosamente',
              cost: 30
            },
            {
              level: 2,
              text: 'Usa una linterna por debajo para ver mejor el patrón',
              cost: 40
            },
            {
              level: 3,
              text: 'Los agujeros alineados forman la palabra BARISTA',
              cost: 50
            }
          ],
          solution: {
            type: 'text',
            value: 'BARISTA',
            explanation: 'Al superponer las tarjetas, los agujeros alineados forman las letras B-A-R-I-S-T-A'
          },
          materials: [
            'Tres tarjetas de fidelidad perforadas',
            'Linterna',
            'Mesa de luz'
          ]
        }
      ]
    }
  ],
  
  roles: [
    {
      id: 'role-investigator',
      name: 'Investigador Principal',
      description: 'Líder del equipo de investigación. Tiene acceso a pistas adicionales y puede coordinar el trabajo del equipo.',
      perks: ['Acceso a pistas premium', 'Coordinación de equipo', 'Validación de soluciones'],
      pointMultiplier: 1.2,
      maxPlayers: 1
    },
    {
      id: 'role-decoder',
      name: 'Descifrador de Códigos',
      description: 'Especialista en códigos y patrones. Excelente para resolver acrósticos y secuencias.',
      perks: ['Bonus en puzzles de códigos', 'Pistas automáticas en acrósticos', 'Validación rápida'],
      pointMultiplier: 1.1,
      maxPlayers: 2
    },
    {
      id: 'role-sensory-expert',
      name: 'Experto Sensorial',
      description: 'Especialista en reconocimiento de aromas y patrones visuales. Ideal para la sala de tostado.',
      perks: ['Bonus en puzzles sensoriales', 'Pistas de aromas', 'Reconocimiento de patrones'],
      pointMultiplier: 1.1,
      maxPlayers: 2
    },
    {
      id: 'role-logic-solver',
      name: 'Resolvedor Lógico',
      description: 'Especialista en lógica y matemáticas. Perfecto para puzzles de conteo y secuencias.',
      perks: ['Bonus en puzzles lógicos', 'Cálculos automáticos', 'Validación matemática'],
      pointMultiplier: 1.1,
      maxPlayers: 2
    }
  ],
  
  // Theme Configuration
  themeName: 'coffee-mystery',
  themeConfig: {
    colors: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#D2691E', // Chocolate
      accent: '#F4A460', // Sandy Brown
      background: '#FFF8DC', // Cornsilk
      text: '#2F1B14' // Dark Brown
    },
    fonts: {
      primary: 'Georgia, serif',
      secondary: 'Arial, sans-serif'
    },
    styling: {
      borderRadius: '8px',
      shadow: '0 4px 6px rgba(139, 69, 19, 0.1)',
      animation: 'coffee-drip'
    }
  },
  
  // Security and Access Control
  securityConfig: {
    requiresAuthentication: true,
    allowAnonymousPlay: false,
    ipWhitelist: [],
    timeRestrictions: {
      startTime: '09:00',
      endTime: '22:00',
      timezone: 'UTC'
    },
    maxConcurrentSessions: 10,
    sessionTimeout: 3600, // 1 hour
    antiCheatEnabled: true
  },
  
  // Multi-player Configuration
  allowsTeams: true,
  maxTeamSize: 6,
  maxParticipants: 50,
  minParticipants: 1,
  
  // Real-time Features
  leaderboardEnabled: true,
  liveTracking: true,
  chatEnabled: true,
  hintsEnabled: true,
  
  // AI Features
  aiPersonalization: false,
  adaptiveDifficulty: false,
  aiAvatarsEnabled: true,
  aiNarrativeEnabled: false,
  
  // Accessibility
  offlineMode: true,
  accessibilityFeatures: [
    'screen_reader_support',
    'high_contrast_mode',
    'text_to_speech',
    'keyboard_navigation',
    'colorblind_friendly'
  ],
  languageSupport: ['en', 'es'],
  
  // Lifecycle
  status: 'published',
  scheduledStart: null,
  scheduledEnd: null,
  tags: ['mystery', 'coffee', 'beginner', 'family-friendly', 'puzzle', 'team-building'],
  isTemplate: false,
  isPublic: true,
  
  // Metrics
  totalSessions: 0,
  totalParticipants: 0,
  averageCompletionTime: null,
  completionRate: 0,
  rating: 0,
  reviewCount: 0,
  
  // Timestamps
  createdAt: new Date(),
  updatedAt: new Date()
}

export default crypticCafeMystery
