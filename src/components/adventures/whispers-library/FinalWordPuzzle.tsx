'use client';

import { useState, useEffect } from 'react';
import { FinalLetter } from '@/data/adventures/whispers-library-data';

interface FinalWordPuzzleProps {
  finalLetters: FinalLetter[];
  finalWordSolution: string;
  onComplete: (solution: string) => void;
  onHint: () => void;
}

export default function FinalWordPuzzle({ finalLetters, finalWordSolution, onComplete, onHint }: FinalWordPuzzleProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [arrangedLetters, setArrangedLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [wordInput, setWordInput] = useState('');
  const [showRevelation, setShowRevelation] = useState(false);

  const availableLetters = finalLetters.map(letter => letter.letter);

  const handleLetterClick = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      setSelectedLetters(selectedLetters.filter(l => l !== letter));
    } else if (selectedLetters.length < 8) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const handleArrangeLetters = () => {
    if (selectedLetters.length === 8) {
      setArrangedLetters([...selectedLetters]);
      setCurrentStep(2);
    } else {
      alert('Debes seleccionar exactamente 8 letras.');
    }
  };

  const handleWordSubmit = () => {
    const cleanInput = wordInput.toUpperCase().replace(/\s/g, '');
    const cleanSolution = finalWordSolution.toUpperCase().replace(/\s/g, '');
    
    if (cleanInput === cleanSolution) {
      onComplete(finalWordSolution);
      setCurrentStep(3);
    } else {
      alert('La palabra no es correcta. Revisa las letras recolectadas y piensa en una palabra relacionada con la biblioteca.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 1: Recopilar todas las letras</h3>
            <p className="text-gray-700">
              Con las letras obtenidas en cada escena, debes formar la palabra clave final.
            </p>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Letras recolectadas:</h4>
              <div className="grid grid-cols-4 gap-4">
                {finalLetters.map((letter, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Escena {letter.scene}</div>
                    <div className="text-2xl font-bold text-amber-800">{letter.letter}</div>
                    <div className="text-xs text-gray-500">{letter.source}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Selecciona las 8 letras:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableLetters.map((letter, index) => (
                  <button
                    key={index}
                    onClick={() => handleLetterClick(letter)}
                    className={`w-12 h-12 border-2 rounded flex items-center justify-center font-bold transition-colors ${
                      selectedLetters.includes(letter)
                        ? 'bg-green-200 border-green-400 text-green-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Letras seleccionadas: {selectedLetters.length}/8
              </div>
            </div>

            <button
              onClick={handleArrangeLetters}
              disabled={selectedLetters.length !== 8}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Organizar Letras
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 2: Formar la palabra clave</h3>
            <p className="text-gray-700">
              Organiza las letras para formar una palabra relacionada con la biblioteca.
            </p>
            <p className="text-gray-700">
              Recuerda la pista del bibliotecario Sloane: "Cada libro tiene un lugar y cada lugar guarda un secreto."
            </p>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Letras organizadas:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {arrangedLetters.map((letter, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 border-2 border-amber-400 bg-amber-200 rounded flex items-center justify-center font-bold text-amber-800"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Pistas disponibles:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Es una palabra relacionada con la biblioteca</li>
                <li>• Contiene 8 letras</li>
                <li>• Está relacionada con el conocimiento y los libros</li>
                <li>• La palabra "CÓDICE" de la escena 3 puede ser una pista</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingresa la palabra clave (8 letras):
              </label>
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value.toUpperCase())}
                maxLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="BIBLIOMA"
              />
            </div>

            <button
              onClick={handleWordSubmit}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Verificar Palabra
            </button>

            <button
              onClick={() => setShowRevelation(!showRevelation)}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showRevelation ? 'Ocultar' : 'Mostrar'} Revelación
            </button>

            {showRevelation && (
              <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ SPOILER ALERT:</h4>
                <p className="text-red-700">
                  La palabra correcta es <strong>BIBLIOMA</strong> (una colección de libros sagrados).
                  Si no quieres ver la solución, no uses esta pista.
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="p-6 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">¡Trampilla Abierta!</h3>
              <p className="text-green-700">
                Suena un clic y la trampilla se abre. En su interior aparece Henry, el custodio, 
                que confiesa ser el asesino porque el investigador descubrió su red de contrabando de libros antiguos.
              </p>
            </div>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Desenlace:</h4>
              <p className="text-gray-700">
                En ese momento, el bibliotecario Sloane, la Dra. Reyes y los demás entran: 
                la historia termina con la justicia lograda. Henry es arrestado; la Biblioteca Monteverde 
                queda a salvo y los jugadores son condecorados.
              </p>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">¡Aventura Completada!</h4>
              <p className="text-blue-700">
                Has resuelto exitosamente "Whispers in the Library". 
                La cooperación y el trabajo en equipo han llevado a la verdad.
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
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Confrontación final y desenlace</h2>
        <p className="text-gray-700">
          Con las letras obtenidas en cada escena, los jugadores llegan a una trampilla con ocho ranuras.
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
          Paso {currentStep} de 3
        </div>
      </div>
    </div>
  );
}
