/**
 * Communication System for The Midnight Express Mystery
 * Handles team communication, coordination, and collaborative puzzle solving
 */

export interface TeamCommunication {
  id: string;
  type: 'chat' | 'voice' | 'gesture' | 'shared_notes' | 'puzzle_collaboration';
  enabled: boolean;
  restrictions: CommunicationRestriction[];
  features: CommunicationFeature[];
}

export interface CommunicationRestriction {
  type: 'scene_based' | 'time_based' | 'puzzle_based' | 'role_based';
  condition: string;
  message: string;
}

export interface CommunicationFeature {
  id: string;
  name: string;
  description: string;
  type: 'real_time' | 'async' | 'broadcast' | 'private';
  enabled: boolean;
  cooldown?: number;
  usageLimit?: number;
}

export interface TeamCoordination {
  id: string;
  name: string;
  description: string;
  requiredRoles: string[];
  sceneId: string;
  puzzleId?: string;
  coordinationType: 'simultaneous' | 'sequential' | 'voting' | 'consensus';
  instructions: string;
  successCriteria: string;
  failureConsequences: string;
}

export interface SharedNotebook {
  id: string;
  name: string;
  description: string;
  sections: NotebookSection[];
  permissions: NotebookPermissions;
  autoSave: boolean;
  versionControl: boolean;
}

export interface NotebookSection {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'puzzle_notes' | 'clue_tracking';
  content: any;
  lastModified: Date;
  modifiedBy: string;
}

export interface NotebookPermissions {
  canRead: string[];
  canWrite: string[];
  canDelete: string[];
  canShare: string[];
}

export const midnightExpressCommunication: TeamCommunication = {
  id: 'midnight-express-communication',
  type: 'chat',
  enabled: true,
  restrictions: [
    {
      type: 'scene_based',
      condition: 'scene-7-engine-room',
      message: 'El ruido del motor dificulta la comunicación. Usen gestos o notas escritas.'
    },
    {
      type: 'time_based',
      condition: 'scene-10-conclusion',
      message: 'Solo tienen 5 minutos para transmitir el mensaje. Coordinación rápida es esencial.'
    },
    {
      type: 'puzzle_based',
      condition: 'puzzle-8-interrogation',
      message: 'Durante el interrogatorio, mantengan silencio para no influir en las respuestas.'
    }
  ],
  features: [
    {
      id: 'real-time-chat',
      name: 'Chat en Tiempo Real',
      description: 'Comunicación instantánea entre todos los miembros del equipo',
      type: 'real_time',
      enabled: true
    },
    {
      id: 'private-messages',
      name: 'Mensajes Privados',
      description: 'Comunicación privada entre dos miembros del equipo',
      type: 'private',
      enabled: true,
      cooldown: 30
    },
    {
      id: 'broadcast-announcement',
      name: 'Anuncios del Equipo',
      description: 'Mensaje que todos los miembros del equipo reciben',
      type: 'broadcast',
      enabled: true,
      cooldown: 60,
      usageLimit: 3
    },
    {
      id: 'puzzle-hint-sharing',
      name: 'Compartir Pistas',
      description: 'Compartir pistas descubiertas con el equipo',
      type: 'broadcast',
      enabled: true,
      cooldown: 0
    }
  ]
};

export const midnightExpressCoordination: TeamCoordination[] = [
  {
    id: 'coordination-1-manifest',
    name: 'Análisis del Manifiesto',
    description: 'El equipo debe trabajar juntos para analizar el manifiesto y encontrar la cabina correcta',
    requiredRoles: ['detective-lead', 'forensic-expert'],
    sceneId: 'scene-1-embarkation',
    puzzleId: 'puzzle-1-manifest',
    coordinationType: 'consensus',
    instructions: 'Cada miembro debe revisar el manifiesto y proponer su solución. El equipo debe llegar a un consenso antes de responder.',
    successCriteria: 'Todos los miembros están de acuerdo con la solución propuesta',
    failureConsequences: 'Si no hay consenso, el equipo pierde tiempo valioso y puede recibir una pista automática'
  },
  {
    id: 'coordination-2-dining',
    name: 'Descifrado del Comedor',
    description: 'El equipo debe dividirse para resolver ambos puzzles del comedor simultáneamente',
    requiredRoles: ['code-breaker', 'forensic-expert'],
    sceneId: 'scene-2-dining-car',
    coordinationType: 'simultaneous',
    instructions: 'Un miembro se enfoca en la servilleta codificada mientras otro descifra el mensaje en Morse. Compartan sus hallazgos.',
    successCriteria: 'Ambos puzzles son resueltos y las pistas se comparten',
    failureConsequences: 'Si un puzzle falla, el otro miembro puede ayudar, pero se pierde tiempo'
  },
  {
    id: 'coordination-3-luggage',
    name: 'Búsqueda de Equipaje',
    description: 'El equipo debe coordinar la búsqueda de maletas específicas en el coche de equipaje',
    requiredRoles: ['detective-lead', 'forensic-expert', 'social-detective'],
    sceneId: 'scene-6-luggage-car',
    puzzleId: 'puzzle-6-luggage-search',
    coordinationType: 'sequential',
    instructions: 'Dividan el coche de equipaje en secciones. Cada miembro busca maletas con criterios específicos y reporta sus hallazgos.',
    successCriteria: 'Todas las maletas requeridas son encontradas y ordenadas correctamente',
    failureConsequences: 'Si las maletas no se ordenan correctamente, el compartimento secreto no se abre'
  },
  {
    id: 'coordination-4-engine',
    name: 'Reparación de la Sala de Máquinas',
    description: 'El equipo debe trabajar juntos para reparar los cables saboteados',
    requiredRoles: ['detective-lead', 'forensic-expert'],
    sceneId: 'scene-7-engine-room',
    puzzleId: 'puzzle-7-cable-connection',
    coordinationType: 'simultaneous',
    instructions: 'Un miembro lee las instrucciones mientras otro conecta los cables. La comunicación debe ser clara y precisa.',
    successCriteria: 'Los cables se conectan correctamente y el sistema de frenos se restaura',
    failureConsequences: 'Si los cables se conectan incorrectamente, el tren puede descarrilar'
  },
  {
    id: 'coordination-5-interrogation',
    name: 'Interrogatorio de Sospechosos',
    description: 'El equipo debe coordinar el interrogatorio de múltiples NPCs',
    requiredRoles: ['social-detective', 'detective-lead'],
    sceneId: 'scene-8-library',
    puzzleId: 'puzzle-8-interrogation',
    coordinationType: 'voting',
    instructions: 'Cada miembro interroga a un NPC diferente. Luego votan sobre qué preguntas hacer y qué respuestas creer.',
    successCriteria: 'El equipo obtiene todas las letras necesarias para formar la palabra clave',
    failureConsequences: 'Si no obtienen todas las letras, no pueden formar la palabra completa'
  },
  {
    id: 'coordination-6-final-decision',
    name: 'Decisión Final',
    description: 'El equipo debe tomar una decisión crítica sobre en quién confiar',
    requiredRoles: ['detective-lead', 'social-detective', 'forensic-expert', 'code-breaker'],
    sceneId: 'scene-9-hidden-car',
    coordinationType: 'consensus',
    instructions: 'Discutan todas las evidencias encontradas y lleguen a un consenso sobre en quién confiar. Esta decisión afectará el final.',
    successCriteria: 'El equipo llega a un consenso y toma una decisión informada',
    failureConsequences: 'Si no hay consenso, la decisión se toma por mayoría, pero puede no ser la mejor opción'
  },
  {
    id: 'coordination-7-telegraph',
    name: 'Transmisión Telegráfica',
    description: 'El equipo debe coordinar la transmisión del mensaje final bajo presión de tiempo',
    requiredRoles: ['detective-lead', 'code-breaker'],
    sceneId: 'scene-10-conclusion',
    puzzleId: 'puzzle-10-telegram',
    coordinationType: 'simultaneous',
    instructions: 'Un miembro forma la palabra mientras otro la transmite por telégrafo. Tienen solo 5 minutos.',
    successCriteria: 'El mensaje se transmite correctamente antes de que se agote el tiempo',
    failureConsequences: 'Si fallan, el criminal puede escapar y el artefacto se pierde'
  }
];

export const midnightExpressNotebook: SharedNotebook = {
  id: 'midnight-express-notebook',
  name: 'Cuaderno de Investigación del Midnight Express',
  description: 'Cuaderno compartido para documentar pistas, teorías y descubrimientos',
  sections: [
    {
      id: 'section-suspects',
      name: 'Sospechosos',
      type: 'puzzle_notes',
      content: {
        suspects: [
          { name: 'Henri Dupont Lemaire', role: 'Conductor', suspicious: true, evidence: [] },
          { name: 'Albert', role: 'Maitre d\'', suspicious: false, evidence: [] },
          { name: 'Madame Aria', role: 'Soprano', suspicious: true, evidence: [] },
          { name: 'Jean Laurent Renaud', role: 'Empresario', suspicious: true, evidence: [] },
          { name: 'Inge Müller Schmidt', role: 'Científica', suspicious: false, evidence: [] },
          { name: 'Nicholas López Álvarez', role: 'Periodista', suspicious: false, evidence: [] }
        ]
      },
      lastModified: new Date(),
      modifiedBy: 'system'
    },
    {
      id: 'section-timeline',
      name: 'Cronología',
      type: 'text',
      content: {
        events: [
          { time: '21:00', event: 'Tren sale de París', location: 'París' },
          { time: '22:00', event: 'Aria paseando', location: 'Tren' },
          { time: '23:00', event: 'Reunión en coche de equipaje', location: 'Coche de equipaje' },
          { time: '23:30', event: 'Henri cenó', location: 'Comedor' },
          { time: '00:00', event: 'Jean en cabina', location: 'Cabina 1A' },
          { time: '00:30', event: 'Aria habló con Inge', location: 'Tren' }
        ]
      },
      lastModified: new Date(),
      modifiedBy: 'system'
    },
    {
      id: 'section-clues',
      name: 'Pistas Encontradas',
      type: 'clue_tracking',
      content: {
        clues: [
          { id: 'clue-1', description: 'Manifiesto con iniciales que forman 3A', scene: 'Embarque', importance: 'high' },
          { id: 'clue-2', description: 'Servilleta con mensaje codificado', scene: 'Comedor', importance: 'high' },
          { id: 'clue-3', description: 'Mensaje Morse: VENTANA DEL COMEDOR', scene: 'Comedor', importance: 'medium' },
          { id: 'clue-4', description: 'Código de maleta: BEE', scene: 'Salón', importance: 'medium' },
          { id: 'clue-5', description: 'Perfume a jazmín en cabina 3A', scene: 'Cabina 3A', importance: 'high' },
          { id: 'clue-6', description: 'Mensaje Morse: ARTEFACTO EN EQUIPAJE', scene: 'Observación', importance: 'high' },
          { id: 'clue-7', description: 'Coordenadas en pasaporte: 4-5; 2-3', scene: 'Equipaje', importance: 'high' },
          { id: 'clue-8', description: 'Palabra formada por interrogatorio: TRAICIÓN', scene: 'Biblioteca', importance: 'high' }
        ]
      },
      lastModified: new Date(),
      modifiedBy: 'system'
    },
    {
      id: 'section-theories',
      name: 'Teorías',
      type: 'text',
      content: {
        theories: [
          { id: 'theory-1', title: 'Émile fue secuestrado', description: 'Alguien lo secuestró por el artefacto', probability: 0.3 },
          { id: 'theory-2', title: 'Émile se escondió', description: 'Se escondió para investigar el contrabando', probability: 0.4 },
          { id: 'theory-3', title: 'Émile es cómplice', description: 'Está involucrado en el contrabando', probability: 0.2 },
          { id: 'theory-4', title: 'Émile fue asesinado', description: 'Fue eliminado por descubrir el contrabando', probability: 0.1 }
        ]
      },
      lastModified: new Date(),
      modifiedBy: 'system'
    }
  ],
  permissions: {
    canRead: ['detective-lead', 'forensic-expert', 'code-breaker', 'social-detective'],
    canWrite: ['detective-lead', 'forensic-expert', 'code-breaker', 'social-detective'],
    canDelete: ['detective-lead'],
    canShare: ['detective-lead', 'forensic-expert']
  },
  autoSave: true,
  versionControl: true
};

export const midnightExpressCommunicationRules = [
  {
    id: 'rule-1',
    name: 'Regla del Silencio en Interrogatorios',
    description: 'Durante los interrogatorios, solo el detective social puede hablar. Los demás deben permanecer en silencio.',
    sceneId: 'scene-8-library',
    penalty: 'Si otros miembros hablan, el NPC se vuelve hostil y da información falsa'
  },
  {
    id: 'rule-2',
    name: 'Regla de Coordinación en Sala de Máquinas',
    description: 'En la sala de máquinas, la comunicación debe ser clara y precisa debido al ruido del motor.',
    sceneId: 'scene-7-engine-room',
    penalty: 'Si la comunicación no es clara, los cables se conectan incorrectamente'
  },
  {
    id: 'rule-3',
    name: 'Regla de Tiempo en Telégrafo',
    description: 'Durante la transmisión telegráfica, solo se permiten mensajes esenciales.',
    sceneId: 'scene-10-conclusion',
    penalty: 'Si se pierde tiempo en comunicación innecesaria, el mensaje no se transmite a tiempo'
  },
  {
    id: 'rule-4',
    name: 'Regla de Consenso en Decisiones',
    description: 'Las decisiones importantes requieren consenso del equipo, no mayoría simple.',
    sceneId: 'scene-9-hidden-car',
    penalty: 'Si no hay consenso, la decisión se toma por mayoría, pero puede no ser la mejor opción'
  }
];

export default {
  communication: midnightExpressCommunication,
  coordination: midnightExpressCoordination,
  notebook: midnightExpressNotebook,
  rules: midnightExpressCommunicationRules
};
