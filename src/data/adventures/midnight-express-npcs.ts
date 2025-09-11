/**
 * NPCs and Characters for The Midnight Express Mystery
 * Interactive characters that players can interact with during the adventure
 */

export interface NPC {
  id: string;
  name: string;
  title: string;
  description: string;
  appearance: string;
  personality: string[];
  motivations: string[];
  secrets: string[];
  dialogue: NPCDialogue[];
  location: string;
  isSuspicious: boolean;
  evidence: string[];
  alibi: string;
}

export interface NPCDialogue {
  id: string;
  trigger: string;
  text: string;
  responses: DialogueResponse[];
  revealsClue?: boolean;
  clueId?: string;
}

export interface DialogueResponse {
  id: string;
  text: string;
  nextDialogueId?: string;
  requiresItem?: string;
  givesItem?: string;
  revealsClue?: boolean;
  clueId?: string;
}

export const midnightExpressNPCs: NPC[] = [
  {
    id: 'henri-conductor',
    name: 'Henri Dupont Lemaire',
    title: 'Conductor del Tren',
    description: 'Un hombre de mediana edad, cordial pero misterioso, que conoce cada rincón del tren.',
    appearance: 'Uniforme azul marino impecable, bigote gris, ojos penetrantes, porte militar.',
    personality: ['Cordial', 'Misterioso', 'Conocedor', 'Sospechoso'],
    motivations: ['Mantener el orden', 'Ocultar secretos', 'Proteger intereses'],
    secrets: ['Involucrado en contrabando', 'Conoce la ubicación del Dr. Fournier'],
    location: 'Sala de máquinas / Cocina',
    isSuspicious: true,
    evidence: ['Documentos de contrabando', 'Perfume a jazmín en su uniforme'],
    alibi: 'Estaba en la sala de máquinas durante la desaparición',
    dialogue: [
      {
        id: 'henri-intro',
        trigger: 'first_meeting',
        text: 'Bienvenidos al Midnight Express. Soy Henri, el conductor. ¿En qué puedo ayudarles con su investigación?',
        responses: [
          {
            id: 'ask-about-fournier',
            text: '¿Qué puede decirnos sobre el Dr. Fournier?',
            nextDialogueId: 'henri-fournier-info',
            revealsClue: true,
            clueId: 'henri-fournier-clue'
          },
          {
            id: 'ask-about-night',
            text: '¿Dónde estuvo usted anoche?',
            nextDialogueId: 'henri-alibi'
          },
          {
            id: 'ask-about-train',
            text: '¿Hay algo inusual en el funcionamiento del tren?',
            nextDialogueId: 'henri-train-info'
          }
        ]
      },
      {
        id: 'henri-fournier-info',
        trigger: 'fournier_question',
        text: 'El Dr. Fournier era un pasajero distinguido. Cenó en el comedor y luego se retiró a su cabina. No lo he visto desde entonces.',
        responses: [
          {
            id: 'ask-last-seen',
            text: '¿Cuándo fue la última vez que lo vio?',
            nextDialogueId: 'henri-last-seen',
            revealsClue: true,
            clueId: 'henri-timing-clue'
          },
          {
            id: 'ask-behavior',
            text: '¿Notó algo extraño en su comportamiento?',
            nextDialogueId: 'henri-behavior'
          }
        ]
      },
      {
        id: 'henri-alibi',
        trigger: 'alibi_question',
        text: 'Estaba en la sala de máquinas toda la noche. El tren requiere supervisión constante, especialmente en esta ruta.',
        responses: [
          {
            id: 'ask-witness',
            text: '¿Alguien puede confirmar eso?',
            nextDialogueId: 'henri-witness',
            revealsClue: true,
            clueId: 'henri-witness-clue'
          }
        ]
      }
    ]
  },
  
  {
    id: 'albert-maitre',
    name: 'Albert',
    title: 'Maitre d\' del Comedor',
    description: 'Jefe de servicio del coche comedor, último en ver al doctor.',
    appearance: 'Traje negro elegante, corbata de moño, gafas de lectura, manos delicadas.',
    personality: ['Profesional', 'Observador', 'Discreto', 'Servicial'],
    motivations: ['Mantener el servicio impecable', 'Ayudar a los detectives'],
    secrets: ['Vio la reunión secreta', 'Conoce sobre el mensaje en la servilleta'],
    location: 'Coche Comedor',
    isSuspicious: false,
    evidence: ['Servilleta con mensaje codificado', 'Testimonio sobre la cena'],
    alibi: 'Estaba sirviendo en el comedor toda la noche',
    dialogue: [
      {
        id: 'albert-intro',
        trigger: 'first_meeting',
        text: 'Buenas noches, detectives. Soy Albert, el maitre d\'. ¿Cómo puedo asistirles en su investigación?',
        responses: [
          {
            id: 'ask-fournier-dinner',
            text: '¿Qué puede decirnos sobre la cena del Dr. Fournier?',
            nextDialogueId: 'albert-dinner-details',
            revealsClue: true,
            clueId: 'albert-dinner-clue'
          },
          {
            id: 'ask-servilleta',
            text: '¿Notó algo especial en la mesa del Dr. Fournier?',
            nextDialogueId: 'albert-servilleta',
            revealsClue: true,
            clueId: 'albert-servilleta-clue'
          }
        ]
      },
      {
        id: 'albert-dinner-details',
        trigger: 'dinner_question',
        text: 'El Dr. Fournier cenó solo, parecía preocupado. Escribió algo en una servilleta y mencionó algo sobre el gramófono.',
        responses: [
          {
            id: 'ask-gramophone',
            text: '¿Qué dijo sobre el gramófono?',
            nextDialogueId: 'albert-gramophone',
            revealsClue: true,
            clueId: 'albert-gramophone-clue'
          }
        ]
      }
    ]
  },
  
  {
    id: 'aria-soprano',
    name: 'Madame Aria Gómez Fiorentino',
    title: 'Soprano Famoso',
    description: 'Una soprano famosa cuya maleta guarda un secreto.',
    appearance: 'Vestido de gala elegante, joyas llamativas, perfume a jazmín, porte artístico.',
    personality: ['Artística', 'Misteriosa', 'Elegante', 'Sospechosa'],
    motivations: ['Proteger su reputación', 'Ocultar su pasado'],
    secrets: ['Usa perfume a jazmín', 'Tuvo una reunión con el Dr. Fournier'],
    location: 'Cabina 1C / Salón',
    isSuspicious: true,
    evidence: ['Perfume a jazmín', 'Maleta con contenido sospechoso'],
    alibi: 'Estaba en su cabina, pero salió a pasear a las 22:00',
    dialogue: [
      {
        id: 'aria-intro',
        trigger: 'first_meeting',
        text: '¡Oh, detectives! Qué emocionante. Soy Aria, soprano. ¿Están investigando esa desaparición tan misteriosa?',
        responses: [
          {
            id: 'ask-perfume',
            text: '¿Qué flor prefieres en tu perfume?',
            nextDialogueId: 'aria-perfume',
            revealsClue: true,
            clueId: 'aria-perfume-clue'
          },
          {
            id: 'ask-fournier',
            text: '¿Conocía al Dr. Fournier?',
            nextDialogueId: 'aria-fournier'
          },
          {
            id: 'ask-night',
            text: '¿Dónde estuvo anoche?',
            nextDialogueId: 'aria-night'
          }
        ]
      },
      {
        id: 'aria-perfume',
        trigger: 'perfume_question',
        text: 'Jazmín, por supuesto. Es mi fragancia característica. ¿Por qué preguntan?',
        responses: [
          {
            id: 'ask-meeting',
            text: '¿Se reunió con alguien anoche?',
            nextDialogueId: 'aria-meeting',
            revealsClue: true,
            clueId: 'aria-meeting-clue'
          }
        ]
      }
    ]
  },
  
  {
    id: 'jean-gambler',
    name: 'Jean Laurent Renaud',
    title: 'Empresario Carismático',
    description: 'Un carismático apostador que oculta su verdadera identidad.',
    appearance: 'Traje elegante, sonrisa encantadora, manos hábiles, mirada calculadora.',
    personality: ['Carismático', 'Calculador', 'Misterioso', 'Peligroso'],
    motivations: ['Obtener el artefacto', 'Mantener su tapadera'],
    secrets: ['Agente doble', 'Involucrado en contrabando', 'Armado'],
    location: 'Salón / Vagón de Observación',
    isSuspicious: true,
    evidence: ['Arma oculta', 'Documentos falsos', 'Conocimiento del artefacto'],
    alibi: 'Estaba en el salón jugando cartas',
    dialogue: [
      {
        id: 'jean-intro',
        trigger: 'first_meeting',
        text: '¡Ah, los detectives! Qué placer. Soy Jean, empresario. ¿Les interesa un juego de cartas mientras investigan?',
        responses: [
          {
            id: 'ask-riddle',
            text: '¿Podrías ayudarnos con un acertijo?',
            nextDialogueId: 'jean-riddle',
            revealsClue: true,
            clueId: 'jean-riddle-clue'
          },
          {
            id: 'ask-business',
            text: '¿Qué tipo de negocio tiene?',
            nextDialogueId: 'jean-business'
          },
          {
            id: 'ask-fournier',
            text: '¿Conocía al Dr. Fournier?',
            nextDialogueId: 'jean-fournier'
          }
        ]
      },
      {
        id: 'jean-riddle',
        trigger: 'riddle_request',
        text: '¡Por supuesto! Tengo tres vagones consecutivos cuya suma de números multiplicada por mi edad (42) da 420. ¿Cuáles son esos números?',
        responses: [
          {
            id: 'answer-riddle',
            text: '2, 3, 5',
            nextDialogueId: 'jean-riddle-correct',
            revealsClue: true,
            clueId: 'jean-date-clue'
          },
          {
            id: 'ask-hint',
            text: '¿Podrías darnos una pista?',
            nextDialogueId: 'jean-hint'
          }
        ]
      }
    ]
  },
  
  {
    id: 'inge-scientist',
    name: 'Inge Müller Schmidt',
    title: 'Científica Alemana',
    description: 'Pasajera alemana experta en códigos y criptografía.',
    appearance: 'Ropa práctica, gafas, cabello recogido, expresión seria.',
    personality: ['Analítica', 'Metódica', 'Inteligente', 'Misteriosa'],
    motivations: ['Resolver el misterio', 'Proteger secretos'],
    secrets: ['Agente de policía secreta', 'Experta en criptografía'],
    location: 'Biblioteca / Salón',
    isSuspicious: false,
    evidence: ['Credencial de policía', 'Conocimiento de códigos'],
    alibi: 'Estaba en la biblioteca estudiando',
    dialogue: [
      {
        id: 'inge-intro',
        trigger: 'first_meeting',
        text: 'Guten Abend. Soy Inge, científica. ¿Están investigando la desaparición del Dr. Fournier?',
        responses: [
          {
            id: 'ask-expertise',
            text: '¿Qué estudiaste en la universidad?',
            nextDialogueId: 'inge-expertise',
            revealsClue: true,
            clueId: 'inge-expertise-clue'
          },
          {
            id: 'ask-help',
            text: '¿Podrías ayudarnos con los códigos?',
            nextDialogueId: 'inge-help'
          },
          {
            id: 'ask-protection',
            text: '¿Necesitas protección?',
            nextDialogueId: 'inge-protection',
            revealsClue: true,
            clueId: 'inge-protection-clue'
          }
        ]
      },
      {
        id: 'inge-expertise',
        trigger: 'expertise_question',
        text: 'Criptografía y matemáticas aplicadas. Puedo ayudarles a descifrar cualquier código que encuentren.',
        responses: [
          {
            id: 'ask-codes',
            text: '¿Has visto algún código en el tren?',
            nextDialogueId: 'inge-codes'
          }
        ]
      }
    ]
  },
  
  {
    id: 'nicholas-journalist',
    name: 'Nicholas López Álvarez',
    title: 'Periodista Curioso',
    description: 'Un periodista curioso por naturaleza que documenta todo.',
    appearance: 'Ropa casual, cámara, cuaderno, expresión inquisitiva.',
    personality: ['Curioso', 'Observador', 'Persistente', 'Honesto'],
    motivations: ['Documentar la historia', 'Descubrir la verdad'],
    secrets: ['Tiene información sobre todos los pasajeros'],
    location: 'Vagón de Observación / Biblioteca',
    isSuspicious: false,
    evidence: ['Notas detalladas', 'Fotografías'],
    alibi: 'Estaba documentando el viaje',
    dialogue: [
      {
        id: 'nicholas-intro',
        trigger: 'first_meeting',
        text: '¡Hola! Soy Nicholas, periodista. ¿Puedo documentar su investigación? Esto será una gran historia.',
        responses: [
          {
            id: 'ask-observations',
            text: '¿Qué has observado en el tren?',
            nextDialogueId: 'nicholas-observations',
            revealsClue: true,
            clueId: 'nicholas-observations-clue'
          },
          {
            id: 'ask-jean',
            text: '¿Confiamos en Jean?',
            nextDialogueId: 'nicholas-jean',
            revealsClue: true,
            clueId: 'nicholas-jean-clue'
          }
        ]
      },
      {
        id: 'nicholas-observations',
        trigger: 'observations_question',
        text: 'He estado documentando todo. Vi a Aria paseando a las 22:00, y a Jean en el salón toda la noche.',
        responses: [
          {
            id: 'ask-details',
            text: '¿Más detalles sobre lo que viste?',
            nextDialogueId: 'nicholas-details'
          }
        ]
      }
    ]
  },
  
  {
    id: 'emile-fournier',
    name: 'Dr. Émile Fournier Barré',
    title: 'Historiador Desaparecido',
    description: 'Reputado historiador que transportaba un artefacto antiguo.',
    appearance: 'Traje académico, gafas, expresión preocupada, maleta elegante.',
    personality: ['Inteligente', 'Preocupado', 'Honesto', 'Valiente'],
    motivations: ['Exponer el contrabando', 'Proteger el artefacto'],
    secrets: ['Fingió su desaparición', 'Descubrió la red de contrabando'],
    location: 'Vagón Oculto',
    isSuspicious: false,
    evidence: ['Artefacto antiguo', 'Documentos de investigación'],
    alibi: 'Estaba escondido en el vagón oculto',
    dialogue: [
      {
        id: 'emile-rescue',
        trigger: 'rescue',
        text: '¡Gracias a Dios que vinieron! Fingí mi desaparición al descubrir que Henri y Jean dirigían una red de contrabando.',
        responses: [
          {
            id: 'ask-contraband',
            text: '¿Qué tipo de contrabando?',
            nextDialogueId: 'emile-contraband'
          },
          {
            id: 'ask-artifact',
            text: '¿Qué es el artefacto?',
            nextDialogueId: 'emile-artifact'
          },
          {
            id: 'ask-evidence',
            text: '¿Tienes evidencia?',
            nextDialogueId: 'emile-evidence'
          }
        ]
      },
      {
        id: 'emile-contraband',
        trigger: 'contraband_question',
        text: 'Artefactos históricos robados. Henri y Jean los transportan en el tren usando su posición.',
        responses: [
          {
            id: 'ask-proof',
            text: '¿Cómo lo sabes?',
            nextDialogueId: 'emile-proof'
          }
        ]
      }
    ]
  }
];

export default midnightExpressNPCs;
