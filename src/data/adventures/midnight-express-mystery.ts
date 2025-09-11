/**
 * The Midnight Express Mystery - Adventure Data
 * A mystery adventure set aboard a luxury train at midnight
 * Duration: 55 minutes, Players: 4-8, Age: 12+, Difficulty: Medium
 */

import { Adventure, Scene, Challenge, Role, AdventureCategory, DifficultyLevel, ChallengeType, InteractionType } from '@/lib/domain/adventure/models'

export const midnightExpressMystery: Adventure = {
  id: 'midnight-express-mystery',
  organizationId: 'cluequest-org',
  creatorId: 'system',
  
  // Basic Properties
  title: 'The Midnight Express Mystery',
  description: 'A mysterious disappearance aboard a luxury train. Can you solve the case before the next station?',
  category: AdventureCategory.ENTERTAINMENT,
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedDuration: 55, // minutes
  
  // Experience Configuration
  settings: {
    allowTeams: true,
    maxTeamSize: 4,
    allowIndividualPlay: false,
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
        minSceneTime: 30,
        maxSceneTime: 3600,
        suspiciousFastCompletion: 60,
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
      id: 'scene-1-embarkation',
      adventureId: 'midnight-express-mystery',
      orderIndex: 1,
      title: 'Embarque y Manifiesto',
      description: 'Al subir al tren, el jefe de estación entrega al equipo seis billetes y un manifiesto de pasajeros.',
      narrative: `El Midnight Express se alza majestuoso bajo la luz de la luna. El vapor se eleva desde la locomotora mientras los pasajeros suben al tren de lujo. El jefe de estación, con su uniforme impecable, les entrega los billetes y un manifiesto de pasajeros.

"Bienvenidos al Midnight Express, señores detectives. El Dr. Émile Fournier ha desaparecido durante el viaje nocturno. Deben resolver este misterio antes de llegar a la próxima estación, o el criminal escapará."

El manifiesto contiene información crucial sobre todos los pasajeros a bordo. Cada detalle podría ser importante para resolver el caso.`,
      
      challenges: [
        {
          id: 'puzzle-1-manifest',
          sceneId: 'scene-1-embarkation',
          type: ChallengeType.SHORT_ANSWER,
          question: `Manifiesto del Midnight Express:

Nº | Pasajero (nombre completo) | Cabina | Observaciones
1  | Henri Dupont Lemaire      | 2B    | Chef del tren
2  | Émile Fournier Barré      | 3A    | Profesor
3  | Aria Gómez Fiorentino     | 1C    | Cantante
4  | Jean Laurent Renaud       | 1A    | Empresario
5  | Inge Müller Schmidt       | 2A    | Científica
6  | Nicholas López Álvarez    | 3B    | Periodista

Instrucciones: Toma la inicial del segundo apellido de cada pasajero (resaltado en negrita) y ordénalas según el número de cabina (1A, 1C, 2A, 2B, 3A, 3B). Las letras obtenidas formarán una palabra. Ese será el número de cabina donde empezarás la investigación.`,
          correctAnswer: '3A',
          difficulty: DifficultyLevel.BEGINNER,
          pointValue: 100,
          hintText: 'Ordena las cabinas en orden ascendente y toma las iniciales de los segundos apellidos. Luego busca un anagrama que forme un número de cabina.'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-1-manifest']
      },
      unlockConditions: [],
      qrCodeRequired: false,
      timeLimit: 600, // 10 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-2-dining-car',
      adventureId: 'midnight-express-mystery',
      orderIndex: 2,
      title: 'Coche Comedor: Mensajes Codificados',
      description: 'En el elegante coche comedor, el maitre d\' Albert les comenta que el Dr. Fournier cenó solo y escribió algo en una servilleta.',
      narrative: `El coche comedor del Midnight Express es un espectáculo de elegancia. Mesas de caoba pulida, manteles de lino blanco y vajilla de porcelana fina. Un viejo gramófono reproduce una pieza clásica que parece tener interferencias.

El maitre d' Albert, un hombre de mediana edad con bigote cuidadosamente recortado, se acerca a su mesa:

"El Dr. Fournier cenó aquí anoche, solo. Parecía preocupado y escribió algo en una servilleta. También mencionó algo sobre el sonido del gramófono... dijo que había un mensaje oculto en la música."

En la mesa, encuentran una servilleta con letras desordenadas, y el gramófono emite sonidos que recuerdan al código Morse.`,
      
      challenges: [
        {
          id: 'puzzle-2-servilleta',
          sceneId: 'scene-2-dining-car',
          type: ChallengeType.SHORT_ANSWER,
          question: `Servilleta encontrada en la mesa del Dr. Fournier:

"A E T I A N U N E I O N N S L E M E D I A N O C H E N E L C O C H E D E E Q U I P A J E"

Instrucciones: Las letras están en el orden equivocado. Usa una cuadrícula 5 × 9 para reordenar las letras leyendo en columnas para descubrir el mensaje.`,
          correctAnswer: 'REUNIÓN A MEDIANOCHE EN EL COCHE DE EQUIPAJE',
          difficulty: DifficultyLevel.INTERMEDIATE,
          pointValue: 150,
          hintText: 'Dibuja una cuadrícula de 5 columnas y 9 filas. Escribe las letras horizontalmente, luego lee verticalmente por columnas.'
        },
        {
          id: 'puzzle-2-morse',
          sceneId: 'scene-2-dining-car',
          type: ChallengeType.SHORT_ANSWER,
          question: `El gramófono emite la secuencia Morse: ...- . -. - .- -. .- / -.. . .-.. / -.-. --- -- . -.. --- .-

Usando el código internacional Morse, traduce este mensaje.`,
          correctAnswer: 'VENTANA DEL COMEDOR',
          difficulty: DifficultyLevel.INTERMEDIATE,
          pointValue: 150,
          hintText: 'Consulta la tabla de código Morse. La secuencia se divide en palabras separadas por /'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-2-servilleta', 'puzzle-2-morse']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-1-embarkation']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 900, // 15 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-3-lounge',
      adventureId: 'midnight-express-mystery',
      orderIndex: 3,
      title: 'Salón: El Equipaje y la Combinación',
      description: 'En el coche salón, decorado con sofás y lámparas de aceite, encuentran la etiqueta de equipaje del Dr. Fournier.',
      narrative: `El coche salón del Midnight Express es un oasis de comodidad. Sofás de cuero marrón, lámparas de aceite que proyectan sombras danzantes, y una biblioteca con libros encuadernados en piel.

En una esquina, una maleta elegante lleva la etiqueta del Dr. Fournier. Un candado de tres ruedas numéricas la mantiene cerrada. Junto a ella, hay un horario del tren con las paradas y horarios.

"Para abrir la maleta, necesitarán descifrar el código basándose en los horarios del tren," susurra una voz desde la penumbra. Es Nicholas, el periodista, que parece haber estado esperando.`,
      
      challenges: [
        {
          id: 'puzzle-3-luggage',
          sceneId: 'scene-3-lounge',
          type: ChallengeType.SHORT_ANSWER,
          question: `Horarios del Midnight Express:
París – 21:00
Lyon – 23:00
Marsella – 04:00
Milán – 09:00
Venecia – 18:00

Instrucciones: Para abrir la maleta, suma la cantidad de horas transcurridas entre cada parada consecutiva (Lyon‑París, Marsella‑Lyon, etc.). Cada cifra resultante se corresponde con una letra (A=1, B=2, C=3…). Ordena las letras en el mismo orden que las paradas y obtendrás el código de tres letras para el candado.`,
          correctAnswer: 'BEE',
          difficulty: DifficultyLevel.INTERMEDIATE,
          pointValue: 200,
          hintText: 'Calcula las diferencias de tiempo entre paradas consecutivas. París→Lyon: 2h, Lyon→Marsella: 5h, etc.'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-3-luggage']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-2-dining-car']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 900, // 15 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-4-cabin-3a',
      adventureId: 'midnight-express-mystery',
      orderIndex: 4,
      title: 'Cabina 3A: Compartimento Secreto',
      description: 'La cabina 3A está en penumbra y parece revuelta. Los objetos están dispuestos de forma sospechosamente ordenada.',
      narrative: `La cabina 3A del Dr. Fournier está en penumbra. Aunque parece revuelta, hay algo extraño en la disposición de los objetos. Todo parece estar colocado con un propósito específico.

En la mesilla hay cuatro objetos etiquetados con números romanos, cada uno con un peso específico. Una nota del Dr. Fournier dice: "Para encontrar lo que busco, pon mis tesoros en orden ascendente. Entonces empuja el panel."

El aire huele a jazmín, el mismo aroma que se percibía en las fotografías encontradas en la maleta.`,
      
      challenges: [
        {
          id: 'puzzle-4-weights',
          sceneId: 'scene-4-cabin-3a',
          type: ChallengeType.SHORT_ANSWER,
          question: `En la mesilla hay cuatro objetos etiquetados con números romanos:
I. Libro de 300 g
II. Lámpara de gas de 500 g
III. Maleta pequeña de 800 g
IV. Reloj de bolsillo de 200 g

Instrucciones: Ordena los objetos de menor a mayor peso usando los números romanos (ej: IV, I, II, III)`,
          correctAnswer: 'IV,I,II,III',
          difficulty: DifficultyLevel.BEGINNER,
          pointValue: 100,
          hintText: 'Ordena de menor a mayor peso: 200g, 300g, 500g, 800g'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-4-weights']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-3-lounge']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 600, // 10 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-5-observation',
      adventureId: 'midnight-express-mystery',
      orderIndex: 5,
      title: 'Plataforma de Observación: Sonidos y Conversaciones',
      description: 'En el vagón de observación, envuelto por el sonido de las ruedas sobre los rieles, un gramófono antiguo reproduce un vals.',
      narrative: `El vagón de observación ofrece una vista espectacular del paisaje nocturno que pasa velozmente. Las ruedas del tren crean un ritmo hipnótico sobre los rieles.

Jean y Nicholas discuten sobre fechas históricas cerca del gramófono. Jean, el carismático apostador, sonríe misteriosamente mientras Nicholas, el periodista, toma notas frenéticamente.

"¿Sabían que hay una fiesta especial en el vagón número...?" Jean deja la frase incompleta, pero su mirada se dirige al gramófono. Al inspeccionarlo con la lupa, encuentran números grabados discretamente en el borde del disco.`,
      
      challenges: [
        {
          id: 'puzzle-5-gramophone',
          sceneId: 'scene-5-observation',
          type: ChallengeType.SHORT_ANSWER,
          question: `Números grabados en el borde del disco: 1 3 5 7 2 4 6 8 9

Una nota dice: "Invierte el orden del disco para escuchar el mensaje". Si giran la manivela en sentido contrario, la música se distorsiona y se escuchan golpes.

Convierte los golpes en puntos y rayas de Morse y traduce el mensaje.`,
          correctAnswer: 'ARTEFACTO EN EQUIPAJE',
          difficulty: DifficultyLevel.ADVANCED,
          pointValue: 250,
          hintText: 'Los números indican el orden de los golpes. Convierte cada golpe a Morse y traduce el mensaje completo.'
        },
        {
          id: 'puzzle-5-jean-riddle',
          sceneId: 'scene-5-observation',
          type: ChallengeType.SHORT_ANSWER,
          question: `Acertijo de Jean: "Tengo tres vagones consecutivos cuya suma de números multiplicada por mi edad (42) da 420. ¿Cuáles son esos números?"

Responde con los tres números separados por comas.`,
          correctAnswer: '2,3,5',
          difficulty: DifficultyLevel.INTERMEDIATE,
          pointValue: 150,
          hintText: '420 ÷ 42 = 10. Busca tres números consecutivos que sumen 10.'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-5-gramophone', 'puzzle-5-jean-riddle']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-4-cabin-3a']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 1200, // 20 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-6-luggage-car',
      adventureId: 'midnight-express-mystery',
      orderIndex: 6,
      title: 'Coche de Equipaje: Búsqueda y Tinta Invisible',
      description: 'Las maletas se apilan en estantes. Un cartel indica que cada equipaje tiene una etiqueta con un color y un número.',
      narrative: `El coche de equipaje es un laberinto de maletas y baúles apilados en estantes metálicos. El aire huele a cuero y polvo, y el sonido de las ruedas del tren es más fuerte aquí.

Cada maleta tiene una etiqueta con un color y un número. La carta de Jean menciona buscar tres maletas específicas. Al encontrar las correctas y alinearlas en el orden indicado, se oye un clic mecánico.

Una maleta se abre revelando un pasaporte que parece vacío, pero al iluminarlo con la linterna UV aparece un mensaje oculto.`,
      
      challenges: [
        {
          id: 'puzzle-6-luggage-search',
          sceneId: 'scene-6-luggage-car',
          type: ChallengeType.SHORT_ANSWER,
          question: `Instrucción de la carta de Jean: "Busca tres maletas: la primera con etiqueta roja y número impar, la segunda con etiqueta azul y número primo, la tercera con etiqueta verde cuyo número sea múltiplo de 3. Colócalas en ese orden en el suelo."

Etiquetas disponibles: Rojo 5, Azul 7, Verde 6, Rojo 8, Azul 4, Verde 9

Responde con los números de las maletas en orden, separados por comas.`,
          correctAnswer: '5,7,6',
          difficulty: DifficultyLevel.INTERMEDIATE,
          pointValue: 200,
          hintText: 'Rojo impar: 5, Azul primo: 7, Verde múltiplo de 3: 6'
        },
        {
          id: 'puzzle-6-invisible-ink',
          sceneId: 'scene-6-luggage-car',
          type: ChallengeType.SHORT_ANSWER,
          question: `Al iluminar el pasaporte con luz UV aparece: "4-5; 2-3"

Esto se refiere a la unión entre los vagones 4 y 5 en la planta superior, segunda tabla desde la izquierda, tercera clavija.

¿Qué acción deben realizar en esa ubicación?`,
          correctAnswer: 'PRESIONAR LA TABLA',
          difficulty: DifficultyLevel.INTERMEDIATE,
          pointValue: 150,
          hintText: 'Las coordenadas indican una ubicación específica donde deben presionar algo.'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-6-luggage-search', 'puzzle-6-invisible-ink']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-5-observation']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 1200, // 20 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-7-engine-room',
      adventureId: 'midnight-express-mystery',
      orderIndex: 7,
      title: 'Sala de Máquinas: Sabotaje',
      description: 'Una puerta metálica conduce a la sala de máquinas. Un teclado numérico pide un código de tres dígitos.',
      narrative: `La sala de máquinas del Midnight Express es un lugar de acero y vapor. El ruido de la locomotora es ensordecedor, y el calor es intenso. Un panel eléctrico muestra tres cables desconectados: rojo, azul y verde.

Un diagrama en el diario del doctor muestra cómo conectar los cables correctamente. Si fallan, un temporizador aparece en la pantalla y tendrán que volver a intentar antes de que se agote el tiempo.

El aroma a jazmín es más fuerte aquí, sugiriendo que la persona que saboteó la máquina usa el mismo perfume encontrado antes.`,
      
      challenges: [
        {
          id: 'puzzle-7-access-code',
          sceneId: 'scene-7-engine-room',
          type: ChallengeType.SHORT_ANSWER,
          question: `El número de serie encontrado en la ventana del comedor es 7421 y la servilleta decía "Suma mis dígitos y multiplícalo por 3 para entrar".

Calcula el código de acceso de tres dígitos.`,
          correctAnswer: '042',
          difficulty: DifficultyLevel.BEGINNER,
          pointValue: 100,
          hintText: '7+4+2+1 = 14, 14 × 3 = 42, formatea como 042'
        },
        {
          id: 'puzzle-7-cable-connection',
          sceneId: 'scene-7-engine-room',
          type: ChallengeType.SHORT_ANSWER,
          question: `Diagrama del diario:
- Conecta el rojo al terminal con la letra más alta
- Conecta el azul entre el rojo y el verde  
- Conecta el verde al terminal restante

Terminales disponibles: A, B, C

Responde con las conexiones en formato: Rojo→X, Azul→Y, Verde→Z`,
          correctAnswer: 'Rojo→C, Azul→B, Verde→A',
          difficulty: DifficultyLevel.INTERMEDIATE,
          pointValue: 200,
          hintText: 'C es la letra más alta, B está entre A y C, A es el terminal restante'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-7-access-code', 'puzzle-7-cable-connection']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-6-luggage-car']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 1200, // 20 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-8-library',
      adventureId: 'midnight-express-mystery',
      orderIndex: 8,
      title: 'Coche de Biblioteca: Deducción de Sospechosos',
      description: 'El vagón biblioteca está lleno de estanterías. Sobre una mesa se dispone un tablero de lógica con tarjetas de los personajes.',
      narrative: `El vagón biblioteca es un santuario de conocimiento. Estanterías de caoba repletas de libros encuadernados en piel, mesas de lectura con lámparas de aceite, y un ambiente de estudio sereno.

Sobre una mesa central, un tablero de lógica contiene tarjetas de los personajes y eventos de la noche. Las pistas impresas en papel pergamino revelan información crucial sobre los movimientos de cada persona.

Tras resolver el rompecabezas lógico, deben interrogar a los NPC restantes con preguntas predefinidas. Cada respuesta correcta revela una letra escondida en los libros.`,
      
      challenges: [
        {
          id: 'puzzle-8-logic-grid',
          sceneId: 'scene-8-library',
          type: ChallengeType.SHORT_ANSWER,
          question: `Pistas del tablero de lógica:

- A las 23:00, alguien se reunió con el doctor en el coche de equipaje
- Henri no salió del comedor hasta después de medianoche
- La persona que estaba en el salón a las 00:00 no era Aria ni Jean
- A las 22:00, Aria estaba paseando
- Jean estuvo en la cabina a medianoche
- Quien cenó en el comedor lo hizo inmediatamente antes de la reunión
- La persona en el coche de equipaje no cenó

¿Quién pudo reunirse con el doctor a las 23:00?`,
          correctAnswer: 'ARIA',
          difficulty: DifficultyLevel.ADVANCED,
          pointValue: 300,
          hintText: 'Usa las pistas para crear una tabla de horarios y ubicaciones para cada personaje.'
        },
        {
          id: 'puzzle-8-interrogation',
          sceneId: 'scene-8-library',
          type: ChallengeType.SHORT_ANSWER,
          question: `Preguntas y respuestas de los NPCs:

- "¿Qué flor prefieres en tu perfume?" (Aria: jazmín) → T
- "¿A qué hora cenaste realmente?" (Henri: 23:30) → R  
- "¿Qué estudiaste en la universidad?" (Inge: criptografía) → A
- "¿En qué vagón pasaste la medianoche?" (Jean: cabina 1A) → I
- "¿Con quién hablaste a las 00:30?" (Aria: con Inge) → C
- "¿Dónde encontraste a Émile?" (Henri: no lo encontré) → I
- "¿Necesitas protección?" (Inge: sí) → Ó
- "¿Confiamos en Jean?" (Nicholas: no) → N

Ordena las letras obtenidas para formar una palabra.`,
          correctAnswer: 'TRAICIÓN',
          difficulty: DifficultyLevel.INTERMEDIATE,
          pointValue: 200,
          hintText: 'Toma las letras en el orden de las preguntas: T, R, A, I, C, I, Ó, N'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-8-logic-grid', 'puzzle-8-interrogation']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-7-engine-room']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 1500, // 25 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-9-hidden-car',
      adventureId: 'midnight-express-mystery',
      orderIndex: 9,
      title: 'Vagón Oculto: La Revelación',
      description: 'Siguiendo las coordenadas del pasaporte, los jugadores hallan una rendija entre los vagones 4 y 5.',
      narrative: `Siguiendo las coordenadas del pasaporte (4‑5; 2‑3), encuentran una rendija casi invisible entre los vagones 4 y 5. Una trampilla oculta tiene un panel con cinco símbolos: ☀ (sol), ★ (estrella), ☾ (luna), ▲ (triángulo) y ◆ (diamante).

Al alinear los engranajes según el ciclo del día, la trampilla se abre revelando un vagón oculto. Dentro, el Dr. Émile está amordazado pero vivo.

"¡Gracias a Dios que vinieron!" exclama al ser liberado. "Fingí mi desaparición al descubrir que el conductor Henri y el empresario Jean dirigían una red de contrabando. Pensaba exponerlos, pero me capturaron."

Pero entonces Jean aparece armado, reclamando el artefacto y confesando que es agente doble. Inge saca una credencial que demuestra que ella también trabaja para la policía secreta.`,
      
      challenges: [
        {
          id: 'puzzle-9-gears',
          sceneId: 'scene-9-hidden-car',
          type: ChallengeType.SHORT_ANSWER,
          question: `Panel con cinco símbolos: ☀ (sol), ★ (estrella), ☾ (luna), ▲ (triángulo) y ◆ (diamante)

Instrucciones: "Alinea los engranajes según el ciclo del día: coloca el engranaje bajo el sol en primer lugar, luego la estrella, luego la luna, y así sucesivamente."

Responde con el orden de los símbolos separados por comas.`,
          correctAnswer: '☀,★,☾,▲,◆',
          difficulty: DifficultyLevel.BEGINNER,
          pointValue: 100,
          hintText: 'Sigue el ciclo natural del día: sol, estrella, luna, triángulo, diamante'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-9-gears']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-8-library']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 600, // 10 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    },
    
    {
      id: 'scene-10-conclusion',
      adventureId: 'midnight-express-mystery',
      orderIndex: 10,
      title: 'Conclusión y Decisión',
      description: 'En el vagón de comunicaciones hay un aparato telegráfico con un panel para introducir letras.',
      narrative: `El vagón de comunicaciones contiene un aparato telegráfico antiguo con un panel para introducir letras. Un papel indica: "Ordena las letras obtenidas a lo largo de la aventura para formar la palabra que necesitas transmitir."

Los jugadores han recolectado letras clave en escenas anteriores. Al ordenar las letras se forma EVIDENCIA. Deben escribirla correctamente en el telegráfico antes de que el cronómetro llegue a cero.

La decisión final afectará el desenlace: ¿Confían en Émile y entregan a Jean, o creen en Jean y sospechan del doctor?`,
      
      challenges: [
        {
          id: 'puzzle-10-telegram',
          sceneId: 'scene-10-conclusion',
          type: ChallengeType.SHORT_ANSWER,
          question: `Letras recolectadas durante la aventura: E, V, I, D, E, N, C, I, A

Ordena las letras para formar la palabra que necesitas transmitir por telégrafo.`,
          correctAnswer: 'EVIDENCIA',
          difficulty: DifficultyLevel.BEGINNER,
          pointValue: 100,
          hintText: 'Reordena las letras para formar una palabra relacionada con pruebas o pruebas de un crimen.'
        }
      ],
      
      interactionType: InteractionType.CHALLENGE_REQUIRED,
      completionCriteria: {
        type: 'all_challenges',
        requiredChallenges: ['puzzle-10-telegram']
      },
      unlockConditions: [
        {
          type: 'scene_completion',
          requiredScenes: ['scene-9-hidden-car']
        }
      ],
      qrCodeRequired: false,
      timeLimit: 300, // 5 minutes
      aiPersonalization: {
        adaptToPlayerSkill: false,
        personalizeNarrative: false,
        customizeVisuals: false,
        adjustDifficulty: false,
        learningStyleAdaptation: false,
      }
    }
  ],
  
  roles: [
    {
      id: 'detective-lead',
      adventureId: 'midnight-express-mystery',
      name: 'Detective Principal',
      description: 'Líder del equipo de detectives encubiertos',
      color: '#1e40af',
      permissions: [RolePermission.VIEW_HINTS, RolePermission.COORDINATE_TEAM, RolePermission.VIEW_LEADERBOARD],
      specialAbilities: [
        {
          id: 'leadership-boost',
          name: 'Liderazgo',
          description: 'Otorga puntos bonus al equipo por coordinación',
          cooldown: 300,
          effectType: 'team_boost'
        }
      ],
      aiAvatarConfig: {
        baseModel: 'detective-male',
        customizations: [],
        voiceSettings: {
          voiceId: 'detective-voice',
          speed: 1.0,
          pitch: 0,
          volume: 0.8,
          language: 'es',
          accent: 'neutral'
        },
        animationSet: ['thinking', 'pointing', 'nodding']
      },
      personalityTraits: [
        {
          name: 'analytical',
          value: 0.8,
          description: 'Muy analítico y lógico'
        },
        {
          name: 'leadership',
          value: 0.9,
          description: 'Fuerte capacidad de liderazgo'
        }
      ],
      unlockableScenes: [],
      bonusPointMultiplier: 1.2
    },
    {
      id: 'forensic-expert',
      adventureId: 'midnight-express-mystery',
      name: 'Experto Forense',
      description: 'Especialista en análisis de evidencia y pistas',
      color: '#059669',
      permissions: [RolePermission.VIEW_HINTS, RolePermission.ACCESS_AR_FEATURES],
      specialAbilities: [
        {
          id: 'evidence-analysis',
          name: 'Análisis de Evidencia',
          description: 'Revela pistas adicionales en objetos',
          cooldown: 600,
          effectType: 'hint'
        }
      ],
      aiAvatarConfig: {
        baseModel: 'scientist-female',
        customizations: [],
        voiceSettings: {
          voiceId: 'scientist-voice',
          speed: 0.9,
          pitch: 5,
          volume: 0.7,
          language: 'es',
          accent: 'neutral'
        },
        animationSet: ['examining', 'writing', 'discovering']
      },
      personalityTraits: [
        {
          name: 'detail-oriented',
          value: 0.9,
          description: 'Extremadamente detallista'
        },
        {
          name: 'methodical',
          value: 0.8,
          description: 'Muy metódico y organizado'
        }
      ],
      unlockableScenes: [],
      bonusPointMultiplier: 1.1
    },
    {
      id: 'code-breaker',
      adventureId: 'midnight-express-mystery',
      name: 'Descifrador de Códigos',
      description: 'Especialista en criptografía y códigos secretos',
      color: '#dc2626',
      permissions: [RolePermission.VIEW_HINTS, RolePermission.SKIP_CHALLENGES],
      specialAbilities: [
        {
          id: 'code-break',
          name: 'Descifrado Rápido',
          description: 'Puede saltar un desafío de código por sesión',
          cooldown: 1800,
          usageLimit: 1,
          effectType: 'skip'
        }
      ],
      aiAvatarConfig: {
        baseModel: 'hacker-male',
        customizations: [],
        voiceSettings: {
          voiceId: 'hacker-voice',
          speed: 1.1,
          pitch: -5,
          volume: 0.8,
          language: 'es',
          accent: 'neutral'
        },
        animationSet: ['typing', 'thinking', 'celebrating']
      },
      personalityTraits: [
        {
          name: 'logical',
          value: 0.9,
          description: 'Muy lógico y matemático'
        },
        {
          name: 'persistent',
          value: 0.7,
          description: 'Persistente en resolver problemas'
        }
      ],
      unlockableScenes: [],
      bonusPointMultiplier: 1.15
    },
    {
      id: 'social-detective',
      adventureId: 'midnight-express-mystery',
      name: 'Detective Social',
      description: 'Especialista en interrogatorios y análisis de comportamiento',
      color: '#7c3aed',
      permissions: [RolePermission.VIEW_HINTS, RolePermission.COORDINATE_TEAM],
      specialAbilities: [
        {
          id: 'social-insight',
          name: 'Perspicacia Social',
          description: 'Obtiene pistas adicionales de NPCs',
          cooldown: 900,
          effectType: 'hint'
        }
      ],
      aiAvatarConfig: {
        baseModel: 'psychologist-female',
        customizations: [],
        voiceSettings: {
          voiceId: 'psychologist-voice',
          speed: 0.95,
          pitch: 3,
          volume: 0.75,
          language: 'es',
          accent: 'neutral'
        },
        animationSet: ['listening', 'questioning', 'understanding']
      },
      personalityTraits: [
        {
          name: 'empathetic',
          value: 0.8,
          description: 'Muy empático y comprensivo'
        },
        {
          name: 'observant',
          value: 0.7,
          description: 'Observador de detalles sociales'
        }
      ],
      unlockableScenes: [],
      bonusPointMultiplier: 1.1
    }
  ],
  
  // QR & Security
  qrCodes: [],
  securityConfig: {
    hmacSecret: 'midnight-express-secret-key',
    tokenExpiration: 60,
    maxQRUsage: 10,
    geoFencing: false,
    proximityTolerance: 50,
    altitudeValidation: false,
    deviceFingerprinting: true,
    suspiciousActivityDetection: true,
    qrScanRateLimit: {
      maxAttempts: 10,
      windowSize: 60,
      blockDuration: 300,
      escalationFactor: 2,
    },
    challengeSubmissionLimit: {
      maxAttempts: 3,
      windowSize: 60,
      blockDuration: 180,
      escalationFactor: 1.5,
    },
  },
  
  // Real-time Features
  allowsTeams: true,
  maxParticipants: 8,
  leaderboardEnabled: true,
  
  // Lifecycle
  status: 'published' as any,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default midnightExpressMystery
