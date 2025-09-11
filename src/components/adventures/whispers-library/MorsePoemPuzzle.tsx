'use client';

import { useState, useEffect } from 'react';
import { MorseData } from '@/data/adventures/whispers-library-data';

interface MorsePoemPuzzleProps {
  morseData: MorseData;
  letterGrid: string[][];
  onComplete: (solution: string) => void;
  onHint: () => void;
}

export default function MorsePoemPuzzle({ morseData, letterGrid, onComplete, onHint }: MorsePoemPuzzleProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [morseInput, setMorseInput] = useState('');
  const [decodedNumbers, setDecodedNumbers] = useState<number[]>([]);
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  const [gridSelection, setGridSelection] = useState<{row: number, col: number}[]>([]);
  const [finalKeyword, setFinalKeyword] = useState('');

  const morseCode: { [key: string]: string } = {
    '·': '.',
    '–': '-',
    ' ': ' '
  };

  const morseToNumber: { [key: string]: string } = {
    '...--': '5',
    '---..': '8',
    '...-': '3',
    '....-': '4'
  };

  const playMorseAudio = () => {
    // Simulate morse code audio playback
    const audio = new Audio('/audio/morse-code.mp3');
    audio.play().catch(() => {
      console.log('Audio playback not available');
    });
  };

  const handleMorseDecode = () => {
    const cleanMorse = morseInput.replace(/[^·–\s]/g, '');
    if (cleanMorse === morseData.morseCode) {
      const numbers = morseData.decodedNumbers;
      setDecodedNumbers(numbers);
      setCurrentStep(2);
    } else {
      alert('El código Morse no es correcto. Escucha atentamente el tictac del reloj.');
    }
  };

  const handleVerseSelection = (verseNumber: number) => {
    if (morseData.decodedNumbers.includes(verseNumber)) {
      setSelectedVerses(prev => [...prev, verseNumber]);
      if (selectedVerses.length + 1 === morseData.decodedNumbers.length) {
        setCurrentStep(3);
      }
    } else {
      alert('Este verso no corresponde a los números decodificados del Morse.');
    }
  };

  const handleGridClick = (row: number, col: number) => {
    const newSelection = [...gridSelection, { row, col }];
    setGridSelection(newSelection);
    
    if (newSelection.length === 4) {
      // Check if the selection forms the word "CÓDICE"
      const selectedLetters = newSelection.map(pos => letterGrid[pos.row][pos.col]);
      const word = selectedLetters.join('');
      
      if (word === 'CÓDICE' || word === 'CODICE') {
        setFinalKeyword('CÓDICE');
        setCurrentStep(4);
      } else {
        alert('Las letras seleccionadas no forman la palabra correcta. Intenta de nuevo.');
        setGridSelection([]);
      }
    }
  };

  const handleKeywordSubmit = () => {
    if (finalKeyword.toUpperCase() === 'CÓDICE' || finalKeyword.toUpperCase() === 'CODICE') {
      onComplete('CÓDICE');
      setCurrentStep(5);
    } else {
      alert('La palabra clave no es correcta.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 1: Decodificar el código Morse</h3>
            <p className="text-gray-700">
              El reloj de bolsillo emite un tictac suave. Escucha atentamente y decodifica el código Morse.
            </p>
            
            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Código Morse del reloj:</h4>
              <div className="font-mono text-lg text-blue-600 bg-white p-3 rounded border">
                {morseData.morseCode}
              </div>
            </div>

            <button
              onClick={playMorseAudio}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🔊 Reproducir Audio
            </button>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingresa el código Morse que escuchas:
              </label>
              <input
                type="text"
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="· – · · ·   – – – –   · – – ·   · · · –"
              />
            </div>

            <button
              onClick={handleMorseDecode}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Decodificar
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 2: Seleccionar versos del poema</h3>
            <p className="text-gray-700">
              Los números decodificados son: {decodedNumbers.join(', ')}
            </p>
            <p className="text-gray-700">
              Selecciona los versos correspondientes del poema:
            </p>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Poema:</h4>
              <div className="space-y-2">
                {morseData.poemVerses.map((verse, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedVerses.includes(index + 1)
                        ? 'bg-green-200 border-2 border-green-400'
                        : decodedNumbers.includes(index + 1)
                        ? 'bg-yellow-100 border-2 border-yellow-300 hover:bg-yellow-200'
                        : 'bg-white border border-gray-300'
                    }`}
                    onClick={() => handleVerseSelection(index + 1)}
                  >
                    <span className="font-bold text-amber-800">{index + 1}.</span> {verse}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Versos seleccionados: {selectedVerses.join(', ')}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 3: Resolver la cuadrícula de letras</h3>
            <p className="text-gray-700">
              Los versos seleccionados te dan pistas sobre qué letras buscar en la cuadrícula.
            </p>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Cuadrícula de letras:</h4>
              <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                {letterGrid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${
                        gridSelection.some(pos => pos.row === rowIndex && pos.col === colIndex)
                          ? 'bg-green-200 border-green-400'
                          : 'bg-white border-gray-300 hover:bg-yellow-100'
                      }`}
                      onClick={() => handleGridClick(rowIndex, colIndex)}
                    >
                      <span className="text-lg font-bold text-amber-800">{letter}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Letras seleccionadas: {gridSelection.length}/4
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 4: Pronunciar la palabra clave</h3>
            <p className="text-gray-700">
              Has encontrado la palabra clave: <strong>{finalKeyword}</strong>
            </p>
            <p className="text-gray-700">
              Pronuncia esta palabra frente al reloj para abrir el compartimento secreto.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirma la palabra clave:
              </label>
              <input
                type="text"
                value={finalKeyword}
                onChange={(e) => setFinalKeyword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={handleKeywordSubmit}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Pronunciar Palabra
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="p-6 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">¡Compartimento Abierto!</h3>
              <p className="text-green-700">
                El reloj se abre revelando una llave y un fragmento de un mapa antiguo para la siguiente escena.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-amber-50 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">El poema y el reloj</h2>
        <p className="text-gray-700">
          La habitación está iluminada tenuemente. En la mesa hay un reloj de bolsillo y un cuaderno con un poema sin título.
        </p>
      </div>

      {renderStep()}

      <div className="mt-6 flex justify-between">
        <button
          onClick={onHint}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Pista
        </button>
        <div className="text-sm text-gray-500">
          Paso {currentStep} de 5
        </div>
      </div>
    </div>
  );
}
