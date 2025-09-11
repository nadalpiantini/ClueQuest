// Whispers in the Library - Adventure Data
// Complete implementation of the library mystery adventure

export interface LibraryCard {
  letter: string;
  author: string;
  title: string;
  callNumber: string;
  note?: string;
}

export interface CipherData {
  encryptedMessage: string;
  key: string;
  decryptedMessage: string;
}

export interface MorseData {
  morseCode: string;
  decodedNumbers: number[];
  poemVerses: string[];
}

export interface UVLetter {
  bookNumber: number;
  letter: string;
  position: number;
}

export interface LogicClue {
  suspect: string;
  statement: string;
  category: 'location' | 'time' | 'activity' | 'object';
}

export interface FinalLetter {
  scene: number;
  letter: string;
  source: string;
}

// Scene 1: Library Card Sorting Puzzle
const libraryCards: LibraryCard[] = [
  {
    letter: 'A',
    author: 'Borges, J. L.',
    title: 'El Aleph',
    callNumber: '863 B714e',
    note: 'Los segundos dígitos de cada número forman una palabra.'
  },
  {
    letter: 'B',
    author: 'Christie, Agatha',
    title: 'Diez Negritos',
    callNumber: '823 C558d'
  },
  {
    letter: 'C',
    author: 'Conan Doyle, A.',
    title: 'El sabueso',
    callNumber: '823 D754s'
  },
  {
    letter: 'D',
    author: 'Eco, Umberto',
    title: 'El nombre de la rosa',
    callNumber: '853 E19n'
  },
  {
    letter: 'E',
    author: 'Grimaldi, F.',
    title: 'Códigos y enigmas',
    callNumber: '003 G867c'
  },
  {
    letter: 'F',
    author: 'Poe, Edgar Allan',
    title: 'Cuentos',
    callNumber: '813 P744c'
  },
  {
    letter: 'G',
    author: 'Rowling, J. K.',
    title: 'La cámara secreta',
    callNumber: '823 R795c'
  },
  {
    letter: 'H',
    author: 'Zafón, Carlos Ruiz',
    title: 'La sombra del viento',
    callNumber: '863 Z193s'
  }
];

// Scene 2: Vigenère Cipher Data
const cipherData: CipherData = {
  encryptedMessage: 'R ACZ CKG EEHC LX STZK LMXRCK OCLK LXU IXKVC',
  key: 'ROSAS',
  decryptedMessage: 'A LAS CINCO EN PUNTO NOS VEMOS JUNTO AL RELICARIO'
};

// Scene 3: Morse Code and Poem Data
const morseData: MorseData = {
  morseCode: '· – · · ·   – – – –   · – – ·   · · · –',
  decodedNumbers: [5, 8, 3, 4],
  poemVerses: [
    'Siete versos son mis pistas, cada línea un guardián',
    'Presta atención a mis rimas y el tiempo te guiará',
    'A las tres se abren portales, a las ocho miran atrás',
    'Las campanas de las doce resuenan y vuelven al compás',
    'Cinco dedos señalan letras, diez números callarán',
    'Oye el tictac en tu pecho, pues el ritmo te dirá',
    'Suma números y letras, y la clave hallarás'
  ]
};

const letterGrid = [
  ['L', 'I', 'B', 'R'],
  ['A', 'N', 'O', 'C'],
  ['T', 'E', 'S', 'A'],
  ['C', 'O', 'D', 'I']
];

// Scene 4: Riddle Data
const riddleData = {
  riddle: `En nuestro templo del saber residimos ocho centinelas silenciosos,
Cuatro miran al oriente y cuatro al occidente.
Somos hermanos de papel y guardamos verdades innumerables.
Si sumas nuestras iniciales, obtendrás el código que abre la puerta.`,
  tomes: [
    { name: 'Ars Magna', initial: 'A', position: 'east' },
    { name: 'Bibliotheca', initial: 'B', position: 'west' },
    { name: 'Crónicas', initial: 'C', position: 'east' },
    { name: 'Diccionario', initial: 'D', position: 'west' },
    { name: 'Enciclopedia', initial: 'E', position: 'east' },
    { name: 'Filosofía', initial: 'F', position: 'west' },
    { name: 'Gramática', initial: 'G', position: 'east' },
    { name: 'Historia', initial: 'H', position: 'west' }
  ],
  solution: 'ABCDEFGH'
};

// Scene 5: UV Light and Anagram Data
const uvLetters: UVLetter[] = [
  { bookNumber: 1, letter: 'E', position: 1 },
  { bookNumber: 2, letter: 'L', position: 2 },
  { bookNumber: 3, letter: 'S', position: 3 },
  { bookNumber: 4, letter: 'E', position: 4 },
  { bookNumber: 5, letter: 'Ñ', position: 5 },
  { bookNumber: 6, letter: 'O', position: 6 },
  { bookNumber: 7, letter: 'R', position: 7 },
  { bookNumber: 8, letter: 'C', position: 8 },
  { bookNumber: 9, letter: 'I', position: 9 },
  { bookNumber: 10, letter: 'P', position: 10 },
  { bookNumber: 11, letter: 'R', position: 11 },
  { bookNumber: 12, letter: 'E', position: 12 }
];

const whisperedPoem = 'Un espejo refleja la verdad, un espejo revela el mal';
const anagramSolution = 'EL SEÑOR CIPRÉS';

// Scene 6: Logic Deduction Puzzle
const logicClues: LogicClue[] = [
  {
    suspect: 'Sloane',
    statement: 'Estaba en la colección general a las 5 p.m. o en el depósito de periódicos',
    category: 'location'
  },
  {
    suspect: 'Reyes',
    statement: 'Consultaba microfilms a las 4 p.m. o a las 5 p.m.',
    category: 'time'
  },
  {
    suspect: 'Black',
    statement: 'Estudió un pergamino o estuvo a las 4 p.m.',
    category: 'activity'
  },
  {
    suspect: 'Clara',
    statement: 'Estuvo a las 4 p.m. o a las 6 p.m.',
    category: 'time'
  },
  {
    suspect: 'Henry',
    statement: 'No estuvo en la colección general ni en la sección de mapas',
    category: 'location'
  }
];

const logicSolution = {
  'Reyes': { time: '4 p.m.', location: 'Microfilms', activity: 'Pergamino' },
  'Sloane': { time: '5 p.m.', location: 'Colección general', activity: 'Diario secreto' },
  'Black': { time: '6 p.m.', location: 'Sección de mapas', activity: 'Pergamino' },
  'Clara': { time: '5 p.m.', location: 'Sección de manuscritos', activity: 'Manuscrito escondido' },
  'Henry': { time: '4 p.m.', location: 'Depósito de periódicos', activity: 'Libro raro' }
};

// Scene 7: Microfilm and Acrostic Data
const microfilmData = {
  poem: `No soy quien piensas, busco el saber;
Si descifras mi nombre, la verdad verás.
Mis letras están ocultas en cada línea;
Usa la pluma del árbol para escribir mi alias.`,
  numberGrid: [
    [11, 3, 18, 9, 22],
    [4, 25, 7, 13, 1],
    [20, 14, 6, 2, 17],
    [5, 21, 10, 24, 8],
    [19, 12, 23, 15, 16]
  ],
  acrosticLetters: ['N', 'S', 'M', 'U'],
  solution: 'REYES'
};

// Scene 8: Final Letter Assembly
const finalLetters: FinalLetter[] = [
  { scene: 1, letter: 'M', source: 'Manuscrito' },
  { scene: 2, letter: 'A', source: 'Ala' },
  { scene: 3, letter: 'P', source: 'Pergamino' },
  { scene: 4, letter: 'L', source: 'Mapa' },
  { scene: 5, letter: 'I', source: 'Espejo' },
  { scene: 6, letter: 'B', source: 'Pluma' },
  { scene: 7, letter: 'R', source: 'Alias' },
  { scene: 8, letter: 'O', source: 'Nota' }
];

const finalWordSolution = 'BIBLIOMA';

// Character Information
const characters = {
  sloane: {
    name: 'Sr. Sloane',
    role: 'Bibliotecario jefe',
    description: 'Conoce todos los rincones de la biblioteca y deja pistas discretas para ayudarte.',
    suspicion: 'low'
  },
  reyes: {
    name: 'Dra. Reyes',
    role: 'Curadora de manuscritos',
    description: 'Aparece como sospechosa. Su conocimiento de criptografía es clave.',
    suspicion: 'high'
  },
  black: {
    name: 'Dr. Black',
    role: 'Profesor de historia',
    description: 'Discute con otros sobre un pergamino antiguo; deja notas criptográficas.',
    suspicion: 'medium'
  },
  clara: {
    name: 'Clara',
    role: 'Estudiante',
    description: 'Aportó un libro raro y está muy nerviosa.',
    suspicion: 'medium'
  },
  henry: {
    name: 'Henry',
    role: 'Custodio',
    description: 'Se mueve en silencio; puede haber visto al asesino.',
    suspicion: 'low'
  }
};

// Materials and Equipment
const requiredMaterials = [
  'Libros antiguos con compartimentos secretos',
  'Tarjetas de catálogo de biblioteca',
  'Rueda cifradora (César/Vigenère)',
  'Linterna de luz ultravioleta',
  'Lupas y bolígrafos',
  'Tablero de lógica',
  'Piezas de rompecabezas',
  'Caja de madera con cerradura de combinación'
];

// Puzzle Solutions Summary
const puzzleSolutions = {
  scene1: {
    sortedCards: libraryCards.sort((a, b) => a.author.localeCompare(b.author)),
    secondDigits: [6, 2, 2, 5, 0, 1, 2, 6],
    phoneNumber: '62250126',
    translatedWord: 'MANUSCR',
    targetBook: 'Códigos y enigmas'
  },
  scene2: {
    key: 'ROSAS',
    decryptedMessage: 'A LAS CINCO EN PUNTO NOS VEMOS JUNTO AL RELICARIO',
    chestCode: 'ALA'
  },
  scene3: {
    morseNumbers: [5, 8, 3, 4],
    keyword: 'CÓDICE',
    gridWords: ['LIBRO', 'SETA'],
    combination: '5645'
  },
  scene4: {
    riddleAnswer: 'ABCDEFGH',
    mapFragment: 'L'
  },
  scene5: {
    uvLetters: uvLetters.map(l => l.letter),
    anagram: 'EL SEÑOR CIPRÉS',
    mirrorLetter: 'I'
  },
  scene6: {
    logicSolution: logicSolution,
    pigpenCode: 'MCSSD',
    metalPen: 'B'
  },
  scene7: {
    acrostic: 'NSMU',
    alias: 'REYES',
    noteLetter: 'O'
  },
  scene8: {
    finalLetters: finalLetters.map(l => l.letter),
    finalWord: 'BIBLIOMA',
    killer: 'Henry'
  }
};

// Export individual items for easier importing
export {
  libraryCards,
  cipherData,
  morseData,
  letterGrid,
  riddleData,
  uvLetters,
  whisperedPoem,
  anagramSolution,
  logicClues,
  logicSolution,
  microfilmData,
  finalLetters,
  finalWordSolution,
  characters,
  requiredMaterials,
  puzzleSolutions
};

export default {
  libraryCards,
  cipherData,
  morseData,
  letterGrid,
  riddleData,
  uvLetters,
  whisperedPoem,
  anagramSolution,
  logicClues,
  logicSolution,
  microfilmData,
  finalLetters,
  finalWordSolution,
  characters,
  requiredMaterials,
  puzzleSolutions
};
