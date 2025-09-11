/**
 * Multiple Endings System for The Midnight Express Mystery
 * Different outcomes based on player decisions and puzzle completion
 */

export interface AdventureEnding {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'partial_success' | 'failure' | 'tragedy';
  requirements: EndingRequirement[];
  narrative: string;
  consequences: string[];
  score: number;
  unlockableContent?: string[];
}

export interface EndingRequirement {
  type: 'puzzle_completion' | 'decision' | 'time_limit' | 'team_consensus';
  value: string | number | boolean;
  sceneId?: string;
  puzzleId?: string;
}

export interface PlayerDecision {
  id: string;
  sceneId: string;
  question: string;
  options: DecisionOption[];
  consequences: DecisionConsequence[];
  affectsEnding: boolean;
}

export interface DecisionOption {
  id: string;
  text: string;
  description: string;
  consequences: string[];
  nextSceneId?: string;
  unlocksEnding?: string[];
  blocksEnding?: string[];
}

export interface DecisionConsequence {
  type: 'unlock_scene' | 'block_scene' | 'change_relationship' | 'affect_ending';
  target: string;
  value: any;
}

export const midnightExpressDecisions: PlayerDecision[] = [
  {
    id: 'decision-jean-trust',
    sceneId: 'scene-9-hidden-car',
    question: 'Jean aparece armado reclamando el artefacto. ¿En quién confían?',
    options: [
      {
        id: 'trust-emile',
        text: 'Confiamos en el Dr. Émile',
        description: 'Creemos que Émile es inocente y Jean es el culpable',
        consequences: [
          'Émile agradece la confianza',
          'Jean se vuelve hostil',
          'Inge revela su identidad como policía'
        ],
        unlocksEnding: ['ending-justice'],
        blocksEnding: ['ending-betrayal']
      },
      {
        id: 'trust-jean',
        text: 'Confiamos en Jean',
        description: 'Creemos que Jean es un agente legítimo y Émile es sospechoso',
        consequences: [
          'Jean se vuelve más amigable',
          'Émile se defiende desesperadamente',
          'Inge se mantiene neutral'
        ],
        unlocksEnding: ['ending-betrayal'],
        blocksEnding: ['ending-justice']
      },
      {
        id: 'trust-neither',
        text: 'No confiamos en ninguno',
        description: 'Mantenemos distancia de ambos hasta tener más evidencia',
        consequences: [
          'Ambos intentan convencer al equipo',
          'La tensión aumenta',
          'Inge debe tomar una decisión'
        ],
        unlocksEnding: ['ending-neutral']
      }
    ],
    consequences: [
      {
        type: 'affect_ending',
        target: 'final_choice',
        value: 'determines_primary_ending'
      }
    ],
    affectsEnding: true
  },
  {
    id: 'decision-telegraph-transmission',
    sceneId: 'scene-10-conclusion',
    question: '¿Transmiten la palabra EVIDENCIA por telégrafo?',
    options: [
      {
        id: 'transmit-evidence',
        text: 'Sí, transmitimos EVIDENCIA',
        description: 'Alertamos a las autoridades sobre el crimen',
        consequences: [
          'Las autoridades son alertadas',
          'El tren será interceptado en la próxima estación',
          'Los criminales serán arrestados'
        ],
        unlocksEnding: ['ending-justice', 'ending-partial-success']
      },
      {
        id: 'dont-transmit',
        text: 'No, no transmitimos nada',
        description: 'Mantenemos silencio y dejamos que los eventos sigan su curso',
        consequences: [
          'No se alerta a las autoridades',
          'Los criminales pueden escapar',
          'El artefacto puede perderse'
        ],
        unlocksEnding: ['ending-betrayal', 'ending-tragedy']
      },
      {
        id: 'transmit-false',
        text: 'Transmitimos información falsa',
        description: 'Enviamos un mensaje engañoso para confundir a los criminales',
        consequences: [
          'Los criminales se confunden',
          'Puede haber consecuencias inesperadas',
          'La situación se vuelve más compleja'
        ],
        unlocksEnding: ['ending-chaos']
      }
    ],
    consequences: [
      {
        type: 'affect_ending',
        target: 'transmission_choice',
        value: 'determines_ending_type'
      }
    ],
    affectsEnding: true
  },
  {
    id: 'decision-cable-repair',
    sceneId: 'scene-7-engine-room',
    question: '¿Intentan reparar los cables saboteados?',
    options: [
      {
        id: 'repair-cables',
        text: 'Sí, reparamos los cables',
        description: 'Restauramos el sistema de frenos del tren',
        consequences: [
          'El tren puede frenar correctamente',
          'Se previene un posible descarrilamiento',
          'El sabotaje es neutralizado'
        ],
        unlocksEnding: ['ending-justice', 'ending-partial-success']
      },
      {
        id: 'ignore-cables',
        text: 'No, ignoramos los cables',
        description: 'Nos enfocamos en resolver el misterio sin reparar el tren',
        consequences: [
          'El tren mantiene problemas de frenos',
          'Riesgo de descarrilamiento',
          'Priorizamos el misterio sobre la seguridad'
        ],
        unlocksEnding: ['ending-tragedy']
      },
      {
        id: 'sabotage-more',
        text: 'Empeoramos el sabotaje',
        description: 'Causamos más daño para forzar una parada de emergencia',
        consequences: [
          'El tren debe detenerse',
          'Mayor riesgo para todos',
          'Acción desesperada'
        ],
        unlocksEnding: ['ending-chaos', 'ending-tragedy']
      }
    ],
    consequences: [
      {
        type: 'affect_ending',
        target: 'safety_choice',
        value: 'affects_safety_outcome'
      }
    ],
    affectsEnding: true
  }
];

export const midnightExpressEndings: AdventureEnding[] = [
  {
    id: 'ending-justice',
    title: 'Justicia Prevalece',
    description: 'Los criminales son arrestados y el artefacto es recuperado',
    type: 'success',
    requirements: [
      {
        type: 'decision',
        value: 'trust-emile',
        sceneId: 'scene-9-hidden-car'
      },
      {
        type: 'decision',
        value: 'transmit-evidence',
        sceneId: 'scene-10-conclusion'
      },
      {
        type: 'puzzle_completion',
        value: 8,
        sceneId: 'all'
      }
    ],
    narrative: `Con la palabra "EVIDENCIA" transmitida por telégrafo, las autoridades son alertadas. En la próxima estación, un destacamento de policía espera al Midnight Express.

Inge revela su placa oficial y arresta a Henri y Jean por contrabando de artefactos históricos. El Dr. Émile es liberado y agradece al equipo por su valentía.

"Gracias a ustedes, estos criminales no podrán continuar robando nuestro patrimonio histórico," dice Émile mientras entrega el artefacto a las autoridades.

El artefacto es devuelto al museo donde pertenece, y el equipo de detectives recibe el reconocimiento por resolver el caso. El Midnight Express continúa su viaje, pero ahora con la seguridad de que la justicia ha prevalecido.`,
    consequences: [
      'Henri y Jean son arrestados',
      'El artefacto es devuelto al museo',
      'Émile es exonerado',
      'El equipo recibe reconocimiento',
      'El tren llega seguro a destino'
    ],
    score: 1000,
    unlockableContent: ['achievement-justice', 'badge-master-detective']
  },
  {
    id: 'ending-partial-success',
    title: 'Éxito Parcial',
    description: 'Se resuelve el misterio pero algunos criminales escapan',
    type: 'partial_success',
    requirements: [
      {
        type: 'decision',
        value: 'transmit-evidence',
        sceneId: 'scene-10-conclusion'
      },
      {
        type: 'puzzle_completion',
        value: 6,
        sceneId: 'all'
      }
    ],
    narrative: `Aunque transmitieron "EVIDENCIA" por telégrafo, no todos los criminales fueron capturados. Henri logra escapar saltando del tren en movimiento, pero Jean es arrestado.

El Dr. Émile es liberado y el artefacto es recuperado, pero la red de contrabando no está completamente desmantelada.

"Al menos detuvimos a uno de ellos," dice Inge mientras revisa las esposas de Jean. "Pero Henri sigue libre, y probablemente intentará vengarse."

El equipo ha resuelto el misterio principal, pero la historia no ha terminado completamente. Henri sigue en libertad, y el artefacto, aunque recuperado, podría estar en peligro nuevamente.`,
    consequences: [
      'Jean es arrestado',
      'Henri escapa',
      'El artefacto es recuperado',
      'Émile es liberado',
      'La red de contrabando no está completamente desmantelada'
    ],
    score: 750,
    unlockableContent: ['achievement-partial-success']
  },
  {
    id: 'ending-betrayal',
    title: 'La Traición',
    description: 'Confían en la persona equivocada y el criminal escapa',
    type: 'failure',
    requirements: [
      {
        type: 'decision',
        value: 'trust-jean',
        sceneId: 'scene-9-hidden-car'
      },
      {
        type: 'decision',
        value: 'dont-transmit',
        sceneId: 'scene-10-conclusion'
      }
    ],
    narrative: `Al confiar en Jean y no transmitir la evidencia, han cometido un error fatal. Jean aprovecha el caos para robar el artefacto y saltar del tren en movimiento.

"¡Gracias por la confianza, detectives!" grita Jean mientras desaparece en la noche con el artefacto. "¡La próxima vez, no confíen tan fácilmente!"

El Dr. Émile, ahora liberado, mira con tristeza al equipo. "Era sincero desde el principio. Jean es un maestro de la manipulación."

El artefacto se pierde, los criminales escapan, y el equipo se da cuenta de que han sido engañados. La lección es dura: en el mundo del espionaje, las apariencias pueden ser engañosas.`,
    consequences: [
      'Jean escapa con el artefacto',
      'Henri también escapa',
      'Émile era inocente',
      'El equipo fue engañado',
      'El artefacto se pierde para siempre'
    ],
    score: 300,
    unlockableContent: ['achievement-betrayed']
  },
  {
    id: 'ending-tragedy',
    title: 'Tragedia en las Vías',
    description: 'El tren descarrila debido al sabotaje no reparado',
    type: 'tragedy',
    requirements: [
      {
        type: 'decision',
        value: 'ignore-cables',
        sceneId: 'scene-7-engine-room'
      }
    ],
    narrative: `Al ignorar el sabotaje en la sala de máquinas, el tren no puede frenar correctamente. En una curva cerrada, el Midnight Express descarrila.

El sonido de metal retorciéndose llena el aire mientras el tren se sale de las vías. Los vagones se vuelcan, y el caos reina en la oscuridad.

Cuando el polvo se asienta, el equipo se da cuenta de que su obsesión por resolver el misterio los llevó a ignorar la seguridad de todos a bordo. El Dr. Émile, Henri, Jean, y muchos otros pasajeros resultan heridos.

"¿Valió la pena?" se pregunta el equipo mientras las luces de emergencia parpadean en la destrucción. A veces, resolver un misterio no es más importante que salvar vidas.`,
    consequences: [
      'El tren descarrila',
      'Múltiples heridos',
      'El misterio queda sin resolver',
      'El equipo se siente culpable',
      'El artefacto se pierde en el caos'
    ],
    score: 100,
    unlockableContent: ['achievement-tragedy']
  },
  {
    id: 'ending-neutral',
    title: 'Neutralidad Cautelosa',
    description: 'Mantienen distancia de todos los sospechosos',
    type: 'partial_success',
    requirements: [
      {
        type: 'decision',
        value: 'trust-neither',
        sceneId: 'scene-9-hidden-car'
      },
      {
        type: 'puzzle_completion',
        value: 7,
        sceneId: 'all'
      }
    ],
    narrative: `Al mantener distancia de todos los sospechosos, el equipo actúa con cautela extrema. Inge, como agente de policía, debe tomar la decisión final.

Después de una cuidadosa evaluación, Inge decide arrestar a Jean por portar un arma sin licencia, pero permite que Émile y Henri expliquen sus versiones.

El artefacto es confiscado como evidencia, y todos los involucrados son interrogados por las autoridades en la próxima estación. La verdad emerge lentamente a través de investigaciones oficiales.

"Su cautela fue sabia," dice Inge al equipo. "A veces, la mejor decisión es no tomar una decisión apresurada."`,
    consequences: [
      'Jean es arrestado por portar arma',
      'Émile y Henri son interrogados',
      'El artefacto es confiscado como evidencia',
      'La investigación continúa oficialmente',
      'El equipo evita tomar decisiones apresuradas'
    ],
    score: 600,
    unlockableContent: ['achievement-cautious']
  },
  {
    id: 'ending-chaos',
    title: 'Caos Total',
    description: 'Las decisiones del equipo crean una situación caótica',
    type: 'failure',
    requirements: [
      {
        type: 'decision',
        value: 'transmit-false',
        sceneId: 'scene-10-conclusion'
      }
    ],
    narrative: `Al transmitir información falsa, el equipo ha creado un caos total. Las autoridades reciben mensajes contradictorios, los criminales se confunden, y la situación se vuelve incontrolable.

En la próxima estación, múltiples equipos de policía con órdenes diferentes crean confusión. Henri y Jean aprovechan el caos para escapar en direcciones opuestas.

El Dr. Émile, atrapado en medio del caos, logra escapar con el artefacto, pero nadie sabe si es para protegerlo o para venderlo.

"¡Esto es un desastre!" grita Inge mientras observa el caos. "Sus decisiones han complicado todo. A veces, la mejor acción es la más simple."`,
    consequences: [
      'Confusión total en las autoridades',
      'Todos los sospechosos escapan',
      'El artefacto desaparece',
      'La situación se vuelve incontrolable',
      'El equipo es reprendido por complicar las cosas'
    ],
    score: 200,
    unlockableContent: ['achievement-chaos']
  }
];

export const midnightExpressAchievements = [
  {
    id: 'achievement-justice',
    name: 'Defensor de la Justicia',
    description: 'Lograste el final perfecto donde todos los criminales son arrestados',
    icon: '⚖️',
    rarity: 'legendary'
  },
  {
    id: 'achievement-partial-success',
    name: 'Éxito Parcial',
    description: 'Resolviste el misterio pero algunos criminales escaparon',
    icon: '🎯',
    rarity: 'rare'
  },
  {
    id: 'achievement-betrayed',
    name: 'Engañado',
    description: 'Confiaste en la persona equivocada y fuiste traicionado',
    icon: '😞',
    rarity: 'common'
  },
  {
    id: 'achievement-tragedy',
    name: 'Tragedia Evitable',
    description: 'El tren descarriló porque ignoraste el sabotaje',
    icon: '💥',
    rarity: 'common'
  },
  {
    id: 'achievement-cautious',
    name: 'Cauteloso',
    description: 'Mantuviste distancia de todos los sospechosos',
    icon: '🤔',
    rarity: 'uncommon'
  },
  {
    id: 'achievement-chaos',
    name: 'Agente del Caos',
    description: 'Tus decisiones crearon una situación caótica',
    icon: '🌪️',
    rarity: 'uncommon'
  },
  {
    id: 'badge-master-detective',
    name: 'Detective Maestro',
    description: 'Resolviste todos los puzzles sin pistas',
    icon: '🕵️',
    rarity: 'legendary'
  }
];

export default {
  decisions: midnightExpressDecisions,
  endings: midnightExpressEndings,
  achievements: midnightExpressAchievements
};
