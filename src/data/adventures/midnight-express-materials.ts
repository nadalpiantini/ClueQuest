/**
 * Materials and Technology for The Midnight Express Mystery
 * Physical materials, QR codes, AR elements, and tech requirements
 */

export interface AdventureMaterial {
  id: string;
  name: string;
  description: string;
  type: 'physical' | 'digital' | 'tech' | 'optional';
  required: boolean;
  quantity: number;
  location: string;
  purpose: string;
  setupInstructions?: string;
}

export interface QRCodeElement {
  id: string;
  sceneId: string;
  name: string;
  description: string;
  content: string;
  location: string;
  unlockCondition?: string;
  revealsClue: boolean;
  clueId?: string;
}

export interface ARElement {
  id: string;
  sceneId: string;
  name: string;
  description: string;
  modelUrl: string;
  triggerType: 'image' | 'location' | 'qr' | 'manual';
  triggerData: string;
  interactionType: 'view' | 'manipulate' | 'examine';
  revealsClue: boolean;
  clueId?: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  sceneId: string;
  triggerCondition: string;
  volume: number;
  loop: boolean;
}

export interface ScentElement {
  id: string;
  name: string;
  description: string;
  scentType: string;
  intensity: number;
  sceneId: string;
  triggerCondition: string;
  purpose: string;
}

export const midnightExpressMaterials: AdventureMaterial[] = [
  // Physical Materials
  {
    id: 'tickets-manifest',
    name: 'Billetes y Manifiesto',
    description: 'Seis billetes de tren y un manifiesto de pasajeros con información detallada',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 1 - Embarque',
    purpose: 'Puzzle de iniciales y ordenamiento de cabinas',
    setupInstructions: 'Imprimir en papel pergamino, envejecer con café, doblar como billetes reales'
  },
  {
    id: 'napkin-coded',
    name: 'Servilleta Codificada',
    description: 'Servilleta con letras desordenadas del Dr. Fournier',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 2 - Comedor',
    purpose: 'Puzzle de transposición de letras',
    setupInstructions: 'Escribir letras en servilleta de papel, manchar ligeramente con café'
  },
  {
    id: 'morse-code-table',
    name: 'Tabla de Código Morse',
    description: 'Tabla internacional de código Morse para descifrar mensajes',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 2 - Comedor',
    purpose: 'Descifrar mensajes en código Morse',
    setupInstructions: 'Imprimir tabla clara y legible en papel resistente'
  },
  {
    'id': 'train-schedule',
    name: 'Horario del Tren',
    description: 'Horario detallado del Midnight Express con paradas y horarios',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 3 - Salón',
    purpose: 'Cálculo de diferencias de tiempo para código de maleta',
    setupInstructions: 'Diseñar como horario de época, imprimir en papel envejecido'
  },
  {
    id: 'luggage-tag',
    name: 'Etiqueta de Equipaje',
    description: 'Etiqueta de la maleta del Dr. Fournier con candado de tres ruedas',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 3 - Salón',
    purpose: 'Puzzle de combinación numérica',
    setupInstructions: 'Crear etiqueta de cuero, candado funcional de tres dígitos'
  },
  {
    id: 'weighted-objects',
    name: 'Objetos con Peso',
    description: 'Libro (300g), lámpara (500g), maleta (800g), reloj (200g)',
    type: 'physical',
    required: true,
    quantity: 4,
    location: 'Escena 4 - Cabina 3A',
    purpose: 'Puzzle de ordenamiento por peso',
    setupInstructions: 'Crear objetos de época con pesos exactos, etiquetar con números romanos'
  },
  {
    id: 'gramophone-disc',
    name: 'Disco de Gramófono',
    description: 'Disco con números grabados y mensaje en código Morse',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 5 - Observación',
    purpose: 'Puzzle de audio y números',
    setupInstructions: 'Crear disco funcional con números grabados, mensaje Morse en audio'
  },
  {
    id: 'luggage-labels',
    name: 'Etiquetas de Maletas',
    description: 'Etiquetas de colores con números para búsqueda en equipaje',
    type: 'physical',
    required: true,
    quantity: 6,
    location: 'Escena 6 - Coche de Equipaje',
    purpose: 'Puzzle de búsqueda y clasificación',
    setupInstructions: 'Crear etiquetas de colores: Rojo 5, Azul 7, Verde 6, Rojo 8, Azul 4, Verde 9'
  },
  {
    id: 'uv-passport',
    name: 'Pasaporte con Tinta Invisible',
    description: 'Pasaporte que revela mensaje con luz UV',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 6 - Coche de Equipaje',
    purpose: 'Revelar coordenadas ocultas',
    setupInstructions: 'Crear pasaporte de época, escribir mensaje con tinta invisible UV'
  },
  {
    id: 'uv-flashlight',
    name: 'Linterna UV',
    description: 'Linterna ultravioleta para revelar tinta invisible',
    type: 'tech',
    required: true,
    quantity: 1,
    location: 'Escena 6 - Coche de Equipaje',
    purpose: 'Revelar mensajes ocultos',
    setupInstructions: 'Proporcionar linterna UV funcional con baterías'
  },
  {
    id: 'engine-panel',
    name: 'Panel de Sala de Máquinas',
    description: 'Panel eléctrico con cables y terminales para conectar',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 7 - Sala de Máquinas',
    purpose: 'Puzzle de conexión de cables',
    setupInstructions: 'Crear panel funcional con cables rojo, azul, verde y terminales A, B, C'
  },
  {
    id: 'logic-board',
    name: 'Tablero de Lógica',
    description: 'Tablero con tarjetas de personajes, horarios y ubicaciones',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 8 - Biblioteca',
    purpose: 'Puzzle de deducción lógica',
    setupInstructions: 'Crear tablero magnético con tarjetas intercambiables'
  },
  {
    id: 'gear-panel',
    name: 'Panel de Engranajes',
    description: 'Panel con cinco engranajes y símbolos del ciclo del día',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 9 - Vagón Oculto',
    purpose: 'Puzzle de ordenamiento de engranajes',
    setupInstructions: 'Crear panel funcional con engranajes que se alineen correctamente'
  },
  {
    id: 'telegraph-machine',
    name: 'Máquina Telegráfica',
    description: 'Aparato telegráfico con panel de letras para transmitir mensaje final',
    type: 'physical',
    required: true,
    quantity: 1,
    location: 'Escena 10 - Conclusión',
    purpose: 'Transmitir palabra final EVIDENCIA',
    setupInstructions: 'Crear máquina telegráfica funcional con panel de letras y temporizador'
  },
  {
    id: 'magnifying-glass',
    name: 'Lupa',
    description: 'Lupa para examinar detalles pequeños en objetos',
    type: 'physical',
    required: true,
    quantity: 2,
    location: 'Múltiples escenas',
    purpose: 'Examinar detalles y encontrar pistas ocultas',
    setupInstructions: 'Proporcionar lupas de buena calidad para examinar objetos'
  },
  {
    id: 'notebook-pencil',
    name: 'Cuaderno y Lápiz',
    description: 'Cuaderno para tomar notas y lápiz para escribir',
    type: 'physical',
    required: true,
    quantity: 4,
    location: 'Múltiples escenas',
    purpose: 'Tomar notas y resolver puzzles',
    setupInstructions: 'Proporcionar cuadernos pequeños y lápices afilados'
  }
];

export const midnightExpressQRCodes: QRCodeElement[] = [
  {
    id: 'qr-dining-window',
    sceneId: 'scene-2-dining-car',
    name: 'QR Ventana del Comedor',
    description: 'QR en la ventana que revela el número de serie del tren',
    content: '7421',
    location: 'Ventana del comedor',
    unlockCondition: 'Resolver puzzle de Morse',
    revealsClue: true,
    clueId: 'train-serial-number'
  },
  {
    id: 'qr-cabin-secret',
    sceneId: 'scene-4-cabin-3a',
    name: 'QR Compartimento Secreto',
    description: 'QR que revela información sobre el símbolo encontrado',
    content: 'El símbolo ☸ representa la rueda del dharma, símbolo de sabiduría y conocimiento',
    location: 'Panel secreto de la cabina',
    unlockCondition: 'Abrir compartimento secreto',
    revealsClue: true,
    clueId: 'symbol-meaning'
  },
  {
    id: 'qr-engine-diagram',
    sceneId: 'scene-7-engine-room',
    name: 'QR Diagrama de Motor',
    description: 'QR que muestra el diagrama de conexión de cables',
    content: 'Diagrama de conexión: Rojo→C, Azul→B, Verde→A',
    location: 'Pared de la sala de máquinas',
    unlockCondition: 'Acceder a sala de máquinas',
    revealsClue: true,
    clueId: 'cable-connection-diagram'
  },
  {
    id: 'qr-hidden-compartment',
    sceneId: 'scene-6-luggage-car',
    name: 'QR Compartimento Oculto',
    description: 'QR que revela la ubicación del compartimento oculto',
    content: 'Coordenadas: Vagón 4-5, Planta superior, Tabla 2, Clavija 3',
    location: 'Pared entre vagones 4 y 5',
    unlockCondition: 'Encontrar pasaporte con tinta invisible',
    revealsClue: true,
    clueId: 'hidden-compartment-location'
  }
];

export const midnightExpressAR: ARElement[] = [
  {
    id: 'ar-train-exterior',
    sceneId: 'scene-1-embarkation',
    name: 'AR Tren Exterior',
    description: 'Vista AR del Midnight Express en la estación',
    modelUrl: '/ar-models/midnight-express-train.glb',
    triggerType: 'image',
    triggerData: '/images/train-station-poster.jpg',
    interactionType: 'view',
    revealsClue: false
  },
  {
    id: 'ar-fournier-ghost',
    sceneId: 'scene-4-cabin-3a',
    name: 'AR Fantasma del Dr. Fournier',
    description: 'Aparición AR del Dr. Fournier en su cabina',
    modelUrl: '/ar-models/dr-fournier-ghost.glb',
    triggerType: 'location',
    triggerData: 'cabin-3a-center',
    interactionType: 'view',
    revealsClue: true,
    clueId: 'fournier-message'
  },
  {
    id: 'ar-sabotage-visualization',
    sceneId: 'scene-7-engine-room',
    name: 'AR Visualización del Sabotaje',
    description: 'Visualización AR de cómo conectar los cables correctamente',
    modelUrl: '/ar-models/cable-connection.glb',
    triggerType: 'qr',
    triggerData: 'qr-engine-diagram',
    interactionType: 'manipulate',
    revealsClue: true,
    clueId: 'cable-connection-guide'
  },
  {
    id: 'ar-artifact-reveal',
    sceneId: 'scene-9-hidden-car',
    name: 'AR Revelación del Artefacto',
    description: 'Visualización AR del artefacto antiguo en 3D',
    modelUrl: '/ar-models/ancient-artifact.glb',
    triggerType: 'manual',
    triggerData: 'artifact-discovery',
    interactionType: 'examine',
    revealsClue: true,
    clueId: 'artifact-details'
  }
];

export const midnightExpressSounds: SoundEffect[] = [
  {
    id: 'sound-train-ambient',
    name: 'Sonido Ambiental del Tren',
    description: 'Sonido de ruedas sobre rieles y motor del tren',
    audioUrl: '/sounds/train-ambient.mp3',
    sceneId: 'all',
    triggerCondition: 'scene_start',
    volume: 0.3,
    loop: true
  },
  {
    id: 'sound-gramophone-morse',
    name: 'Morse en Gramófono',
    description: 'Sonido distorsionado del gramófono con mensaje en Morse',
    audioUrl: '/sounds/gramophone-morse.mp3',
    sceneId: 'scene-5-observation',
    triggerCondition: 'reverse_gramophone',
    volume: 0.7,
    loop: false
  },
  {
    id: 'sound-secret-panel',
    name: 'Sonido de Panel Secreto',
    description: 'Sonido de clic cuando se abre el panel secreto',
    audioUrl: '/sounds/secret-panel-click.mp3',
    sceneId: 'scene-4-cabin-3a',
    triggerCondition: 'correct_weight_order',
    volume: 0.8,
    loop: false
  },
  {
    id: 'sound-luggage-click',
    name: 'Sonido de Maleta',
    description: 'Sonido de clic cuando se abre la maleta correcta',
    audioUrl: '/sounds/luggage-click.mp3',
    sceneId: 'scene-6-luggage-car',
    triggerCondition: 'correct_luggage_order',
    volume: 0.6,
    loop: false
  },
  {
    id: 'sound-engine-start',
    name: 'Sonido de Motor',
    description: 'Sonido del motor del tren cuando se arreglan los cables',
    audioUrl: '/sounds/engine-start.mp3',
    sceneId: 'scene-7-engine-room',
    triggerCondition: 'correct_cable_connection',
    volume: 0.9,
    loop: false
  },
  {
    id: 'sound-telegraph',
    name: 'Sonido de Telégrafo',
    description: 'Sonido de transmisión telegráfica',
    audioUrl: '/sounds/telegraph-transmission.mp3',
    sceneId: 'scene-10-conclusion',
    triggerCondition: 'telegraph_transmission',
    volume: 0.8,
    loop: false
  },
  {
    id: 'sound-success',
    name: 'Sonido de Éxito',
    description: 'Sonido de celebración al resolver un puzzle',
    audioUrl: '/sounds/puzzle-success.mp3',
    sceneId: 'all',
    triggerCondition: 'puzzle_solved',
    volume: 0.7,
    loop: false
  }
];

export const midnightExpressScents: ScentElement[] = [
  {
    id: 'scent-jasmine',
    name: 'Aroma a Jazmín',
    description: 'Fragancia floral de jazmín que aparece en varias escenas',
    scentType: 'floral',
    intensity: 0.6,
    sceneId: 'scene-4-cabin-3a,scene-7-engine-room',
    triggerCondition: 'scene_enter',
    purpose: 'Conectar pistas sobre Madame Aria'
  },
  {
    id: 'scent-leather',
    name: 'Aroma a Cuero',
    description: 'Olor a cuero envejecido en el coche de equipaje',
    scentType: 'leather',
    intensity: 0.4,
    sceneId: 'scene-6-luggage-car',
    triggerCondition: 'scene_enter',
    purpose: 'Ambientación de época'
  },
  {
    id: 'scent-coal-smoke',
    name: 'Aroma a Carbón',
    description: 'Olor a humo de carbón en la sala de máquinas',
    scentType: 'smoke',
    intensity: 0.5,
    sceneId: 'scene-7-engine-room',
    triggerCondition: 'scene_enter',
    purpose: 'Ambientación de locomotora de vapor'
  },
  {
    id: 'scent-old-books',
    name: 'Aroma a Libros Antiguos',
    description: 'Fragancia de papel envejecido en la biblioteca',
    scentType: 'paper',
    intensity: 0.3,
    sceneId: 'scene-8-library',
    triggerCondition: 'scene_enter',
    purpose: 'Ambientación de biblioteca de época'
  }
];

export default {
  materials: midnightExpressMaterials,
  qrCodes: midnightExpressQRCodes,
  arElements: midnightExpressAR,
  sounds: midnightExpressSounds,
  scents: midnightExpressScents
};
