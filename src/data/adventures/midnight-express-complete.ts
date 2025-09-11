/**
 * Complete Midnight Express Mystery Adventure
 * Integrates all systems: scenes, NPCs, materials, progression, communication, and endings
 */

import { Adventure } from '@/lib/domain/adventure/models'
import midnightExpressMystery from './midnight-express-mystery'
import midnightExpressNPCs from './midnight-express-npcs'
import midnightExpressMaterials from './midnight-express-materials'
import midnightExpressEndings from './midnight-express-endings'
import midnightExpressProgression from './midnight-express-progression'
import midnightExpressCommunication from './midnight-express-communication'

export interface CompleteMidnightExpressAdventure extends Adventure {
  // Extended properties for complete adventure
  npcs: typeof midnightExpressNPCs;
  materials: typeof midnightExpressMaterials;
  endings: typeof midnightExpressEndings;
  progression: typeof midnightExpressProgression;
  communication: typeof midnightExpressCommunication;
  
  // Adventure-specific metadata
  setupGuide: SetupGuide;
  masterGuide: MasterGuide;
  playerGuide: PlayerGuide;
}

export interface SetupGuide {
  id: string;
  title: string;
  description: string;
  estimatedSetupTime: number; // minutes
  requiredSpace: string;
  requiredMaterials: string[];
  optionalMaterials: string[];
  setupSteps: SetupStep[];
  safetyConsiderations: string[];
  troubleshooting: TroubleshootingItem[];
}

export interface SetupStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // minutes
  requiredMaterials: string[];
  instructions: string[];
  tips: string[];
}

export interface TroubleshootingItem {
  id: string;
  problem: string;
  solution: string;
  prevention: string;
}

export interface MasterGuide {
  id: string;
  title: string;
  description: string;
  role: 'master' | 'facilitator' | 'observer';
  responsibilities: string[];
  sceneGuidance: SceneGuidance[];
  npcGuidance: NPCGuidance[];
  timingGuidance: TimingGuidance[];
  emergencyProcedures: EmergencyProcedure[];
}

export interface SceneGuidance {
  sceneId: string;
  title: string;
  objectives: string[];
  keyPoints: string[];
  commonIssues: string[];
  solutions: string[];
  timing: {
    minTime: number;
    maxTime: number;
    optimalTime: number;
  };
}

export interface NPCGuidance {
  npcId: string;
  name: string;
  personality: string[];
  motivations: string[];
  keyDialogue: string[];
  behaviorTips: string[];
  commonQuestions: string[];
  answers: string[];
}

export interface TimingGuidance {
  sceneId: string;
  totalTime: number;
  bufferTime: number;
  warningTime: number;
  actions: TimingAction[];
}

export interface TimingAction {
  time: number;
  action: string;
  description: string;
}

export interface EmergencyProcedure {
  id: string;
  situation: string;
  steps: string[];
  contacts: string[];
  equipment: string[];
}

export interface PlayerGuide {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  objectives: string[];
  skills: string[];
  preparation: string[];
  tips: string[];
  commonMistakes: string[];
  successStrategies: string[];
}

export const completeMidnightExpressAdventure: CompleteMidnightExpressAdventure = {
  ...midnightExpressMystery,
  
  // Extended properties
  npcs: midnightExpressNPCs,
  materials: midnightExpressMaterials,
  endings: midnightExpressEndings,
  progression: midnightExpressProgression,
  communication: midnightExpressCommunication,
  
  // Adventure-specific metadata
  setupGuide: {
    id: 'midnight-express-setup',
    title: 'Guía de Configuración - The Midnight Express Mystery',
    description: 'Guía completa para configurar la aventura The Midnight Express Mystery',
    estimatedSetupTime: 45,
    requiredSpace: 'Sala grande (mínimo 50m²) con múltiples áreas separadas',
    requiredMaterials: [
      'Manifiesto de pasajeros',
      'Servilleta codificada',
      'Tabla de código Morse',
      'Horario del tren',
      'Etiqueta de equipaje con candado',
      'Objetos con peso (libro, lámpara, maleta, reloj)',
      'Disco de gramófono',
      'Etiquetas de maletas de colores',
      'Pasaporte con tinta invisible',
      'Linterna UV',
      'Panel de sala de máquinas',
      'Tablero de lógica',
      'Panel de engranajes',
      'Máquina telegráfica',
      'Lupas',
      'Cuadernos y lápices'
    ],
    optionalMaterials: [
      'Efectos de sonido ambientales',
      'Fragancias (jazmín, cuero, humo de carbón)',
      'Iluminación de época',
      'Decoración de tren de lujo',
      'Dispositivos AR/QR',
      'Sistema de audio',
      'Cámaras de seguridad',
      'Sistema de monitoreo'
    ],
    setupSteps: [
      {
        id: 'step-1-space',
        title: 'Preparación del Espacio',
        description: 'Configurar las diferentes áreas del tren',
        estimatedTime: 15,
        requiredMaterials: ['Decoración de tren', 'Iluminación'],
        instructions: [
          'Dividir el espacio en 10 áreas representando los vagones',
          'Marcar claramente cada área con carteles',
          'Configurar iluminación de época (lámparas de aceite simuladas)',
          'Colocar decoración de tren de lujo en cada área'
        ],
        tips: [
          'Usar cortinas o separadores para crear privacidad',
          'Asegurar que cada área tenga suficiente espacio para 4-8 personas',
          'Verificar que la iluminación sea adecuada para leer'
        ]
      },
      {
        id: 'step-2-materials',
        title: 'Colocación de Materiales',
        description: 'Colocar todos los materiales en sus ubicaciones correctas',
        estimatedTime: 20,
        requiredMaterials: ['Todos los materiales físicos'],
        instructions: [
          'Colocar manifiesto en área de embarque',
          'Configurar servilleta y gramófono en comedor',
          'Colocar horario y etiqueta de equipaje en salón',
          'Configurar objetos con peso en cabina 3A',
          'Colocar disco de gramófono en observación',
          'Configurar etiquetas de maletas en coche de equipaje',
          'Colocar panel de máquinas en sala de máquinas',
          'Configurar tablero de lógica en biblioteca',
          'Colocar panel de engranajes en vagón oculto',
          'Configurar máquina telegráfica en conclusión'
        ],
        tips: [
          'Verificar que todos los materiales estén en buen estado',
          'Asegurar que los candados funcionen correctamente',
          'Probar que la linterna UV funcione',
          'Verificar que la máquina telegráfica esté operativa'
        ]
      },
      {
        id: 'step-3-tech',
        title: 'Configuración Tecnológica',
        description: 'Configurar elementos tecnológicos y AR/QR',
        estimatedTime: 10,
        requiredMaterials: ['Dispositivos AR/QR', 'Sistema de audio'],
        instructions: [
          'Configurar códigos QR en ubicaciones correctas',
          'Probar elementos AR',
          'Configurar sistema de audio para efectos sonoros',
          'Verificar conectividad de dispositivos',
          'Probar sistema de comunicación del equipo'
        ],
        tips: [
          'Tener dispositivos de respaldo disponibles',
          'Verificar que todos los códigos QR funcionen',
          'Probar el sistema de audio en todas las áreas',
          'Asegurar que la comunicación del equipo funcione'
        ]
      }
    ],
    safetyConsiderations: [
      'Verificar que todos los materiales sean seguros para manipular',
      'Asegurar que no haya objetos afilados o peligrosos',
      'Verificar que la iluminación sea adecuada para evitar tropiezos',
      'Asegurar que haya salidas de emergencia claramente marcadas',
      'Verificar que el sistema de comunicación funcione en caso de emergencia'
    ],
    troubleshooting: [
      {
        id: 'trouble-1',
        problem: 'Los candados no funcionan',
        solution: 'Verificar que las combinaciones estén configuradas correctamente y que los candados estén lubricados',
        prevention: 'Probar todos los candados antes de la aventura'
      },
      {
        id: 'trouble-2',
        problem: 'La linterna UV no funciona',
        solution: 'Verificar las baterías y tener una linterna de respaldo disponible',
        prevention: 'Probar la linterna UV y tener baterías de respaldo'
      },
      {
        id: 'trouble-3',
        problem: 'Los códigos QR no se escanean',
        solution: 'Verificar que los códigos estén impresos correctamente y que la iluminación sea adecuada',
        prevention: 'Probar todos los códigos QR antes de la aventura'
      },
      {
        id: 'trouble-4',
        problem: 'El sistema de audio no funciona',
        solution: 'Verificar la conectividad y tener un sistema de respaldo disponible',
        prevention: 'Probar el sistema de audio en todas las áreas antes de la aventura'
      }
    ]
  },
  
  masterGuide: {
    id: 'midnight-express-master',
    title: 'Guía del Maestro - The Midnight Express Mystery',
    description: 'Guía completa para facilitar la aventura The Midnight Express Mystery',
    role: 'facilitator',
    responsibilities: [
      'Monitorear el progreso del equipo',
      'Proporcionar pistas cuando sea necesario',
      'Mantener el ritmo de la aventura',
      'Asegurar que todos los jugadores participen',
      'Manejar situaciones de emergencia',
      'Documentar el rendimiento del equipo'
    ],
    sceneGuidance: [
      {
        sceneId: 'scene-1-embarkation',
        title: 'Embarque y Manifiesto',
        objectives: [
          'Presentar la aventura y establecer el tono',
          'Resolver el puzzle del manifiesto',
          'Establecer la dinámica del equipo'
        ],
        keyPoints: [
          'El puzzle del manifiesto es fundamental para el resto de la aventura',
          'Asegurar que todos los miembros del equipo participen en el análisis',
          'Establecer que la comunicación y colaboración son esenciales'
        ],
        commonIssues: [
          'Los jugadores no entienden las instrucciones del puzzle',
          'Algunos jugadores dominan la conversación',
          'El equipo se frustra si no resuelve el puzzle rápidamente'
        ],
        solutions: [
          'Explicar claramente las instrucciones y dar ejemplos',
          'Fomentar la participación de todos los miembros',
          'Proporcionar pistas progresivas si es necesario'
        ],
        timing: {
          minTime: 5,
          maxTime: 15,
          optimalTime: 10
        }
      },
      {
        sceneId: 'scene-2-dining-car',
        title: 'Coche Comedor: Mensajes Codificados',
        objectives: [
          'Resolver el puzzle de la servilleta',
          'Descifrar el mensaje en Morse',
          'Establecer la importancia de trabajar en equipo'
        ],
        keyPoints: [
          'Este es el primer puzzle que requiere división del equipo',
          'Ambos puzzles deben resolverse para continuar',
          'Las pistas se complementan entre sí'
        ],
        commonIssues: [
          'El equipo se divide pero no comparte información',
          'Algunos jugadores no entienden el código Morse',
          'El puzzle de la servilleta es demasiado difícil'
        ],
        solutions: [
          'Fomentar la comunicación entre los subequipos',
          'Proporcionar la tabla de Morse y explicar su uso',
          'Dar pistas sobre la cuadrícula 5x9'
        ],
        timing: {
          minTime: 10,
          maxTime: 20,
          optimalTime: 15
        }
      }
    ],
    npcGuidance: [
      {
        npcId: 'henri-conductor',
        name: 'Henri Dupont Lemaire',
        personality: ['Cordial', 'Misterioso', 'Conocedor', 'Sospechoso'],
        motivations: ['Mantener el orden', 'Ocultar secretos', 'Proteger intereses'],
        keyDialogue: [
          'Bienvenidos al Midnight Express. ¿En qué puedo ayudarles?',
          'El Dr. Fournier era un pasajero distinguido',
          'Estaba en la sala de máquinas toda la noche'
        ],
        behaviorTips: [
          'Mantener un tono profesional pero evasivo',
          'No revelar información directamente',
          'Sugerir que conoce más de lo que dice'
        ],
        commonQuestions: [
          '¿Qué puede decirnos sobre el Dr. Fournier?',
          '¿Dónde estuvo usted anoche?',
          '¿Hay algo inusual en el funcionamiento del tren?'
        ],
        answers: [
          'Era un pasajero distinguido, no lo he visto desde anoche',
          'Estaba en la sala de máquinas, el tren requiere supervisión constante',
          'El tren funciona normalmente, pero hay mucho que supervisar'
        ]
      }
    ],
    timingGuidance: [
      {
        sceneId: 'scene-1-embarkation',
        totalTime: 10,
        bufferTime: 2,
        warningTime: 8,
        actions: [
          { time: 0, action: 'Presentar la aventura', description: 'Explicar el contexto y objetivos' },
          { time: 2, action: 'Entregar materiales', description: 'Dar manifiesto y billetes' },
          { time: 5, action: 'Monitorear progreso', description: 'Observar cómo el equipo aborda el puzzle' },
          { time: 8, action: 'Advertencia de tiempo', description: 'Recordar que tienen 2 minutos restantes' },
          { time: 10, action: 'Transición', description: 'Mover al siguiente escena' }
        ]
      }
    ],
    emergencyProcedures: [
      {
        id: 'emergency-1',
        situation: 'Jugador se lesiona',
        steps: [
          'Detener inmediatamente la aventura',
          'Evaluar la gravedad de la lesión',
          'Proporcionar primeros auxilios si es necesario',
          'Contactar servicios médicos si es grave',
          'Documentar el incidente'
        ],
        contacts: ['Servicios médicos de emergencia', 'Supervisor de la instalación'],
        equipment: ['Botiquín de primeros auxilios', 'Teléfono de emergencia']
      },
      {
        id: 'emergency-2',
        situation: 'Fallo técnico crítico',
        steps: [
          'Identificar el problema técnico',
          'Intentar solucionarlo rápidamente',
          'Usar sistemas de respaldo si están disponibles',
          'Adaptar la aventura si es necesario',
          'Comunicar el problema a los jugadores'
        ],
        contacts: ['Soporte técnico', 'Supervisor de la instalación'],
        equipment: ['Dispositivos de respaldo', 'Herramientas de reparación']
      }
    ]
  },
  
  playerGuide: {
    id: 'midnight-express-player',
    title: 'Guía del Jugador - The Midnight Express Mystery',
    description: 'Guía para jugadores de The Midnight Express Mystery',
    targetAudience: 'Jugadores de 12+ años, equipos de 4-8 personas',
    objectives: [
      'Resolver el misterio de la desaparición del Dr. Fournier',
      'Descubrir la red de contrabando',
      'Prevenir el sabotaje del tren',
      'Tomar decisiones que afecten el final de la aventura'
    ],
    skills: [
      'Pensamiento crítico',
      'Observación',
      'Comunicación',
      'Deducción',
      'Trabajo en equipo',
      'Resolución de problemas',
      'Análisis lógico',
      'Coordinación'
    ],
    preparation: [
      'Leer la sinopsis de la aventura',
      'Entender el contexto histórico (1920s)',
      'Familiarizarse con el código Morse básico',
      'Prepararse para trabajar en equipo',
      'Tener una mente abierta y curiosa'
    ],
    tips: [
      'Comunícate constantemente con tu equipo',
      'Toma notas de todo lo que encuentres',
      'No descartes ningún detalle, por pequeño que sea',
      'Trabaja en equipo, no compitas entre ustedes',
      'Usa todos los sentidos para encontrar pistas',
      'Mantén la calma bajo presión',
      'Confía en tu instinto pero verifica con evidencia'
    ],
    commonMistakes: [
      'No comunicar hallazgos al equipo',
      'Ignorar detalles aparentemente menores',
      'Tomar decisiones apresuradas sin considerar todas las opciones',
      'No usar todos los materiales disponibles',
      'Frustrarse y rendirse demasiado rápido',
      'No coordinar acciones en puzzles que requieren trabajo en equipo'
    ],
    successStrategies: [
      'Asigna roles específicos a cada miembro del equipo',
      'Mantén un cuaderno de notas compartido',
      'Revisa regularmente lo que han aprendido',
      'No tengas miedo de pedir pistas si es necesario',
      'Mantén un registro de todas las pistas encontradas',
      'Discute teorías y posibilidades con el equipo',
      'Verifica tus conclusiones antes de actuar'
    ]
  }
};

export default completeMidnightExpressAdventure;
