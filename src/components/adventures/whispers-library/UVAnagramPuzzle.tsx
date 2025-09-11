'use client';

import { useState, useEffect } from 'react';
import { UVLetter } from '@/data/adventures/whispers-library-data';

interface UVAnagramPuzzleProps {
  uvLetters: UVLetter[];
  whisperedPoem: string;
  anagramSolution: string;
  onComplete: (solution: string) => void;
  onHint: () => void;
}

export default function UVAnagramPuzzle({ uvLetters, whisperedPoem, anagramSolution, onComplete, onHint }: UVAnagramPuzzleProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uvLightOn, setUvLightOn] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [anagramInput, setAnagramInput] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [showPoem, setShowPoem] = useState(false);

  const toggleUVLight = () => {
    setUvLightOn(!uvLightOn);
    if (!uvLightOn) {
      // Simulate UV light revealing letters
      setTimeout(() => {
        setRevealedLetters(uvLetters.map(l => l.letter));
        setCurrentStep(2);
      }, 1000);
    }
  };

  const handleBookClick = (bookNumber: number) => {
    if (selectedBooks.includes(bookNumber)) {
      setSelectedBooks(selectedBooks.filter(num => num !== bookNumber));
    } else {
      setSelectedBooks([...selectedBooks, bookNumber]);
    }
  };

  const handleAnagramSubmit = () => {
    const cleanInput = anagramInput.toUpperCase().replace(/\s/g, '');
    const cleanSolution = anagramSolution.toUpperCase().replace(/\s/g, '');
    
    if (cleanInput === cleanSolution) {
      onComplete(anagramSolution);
      setCurrentStep(4);
    } else {
      alert('El anagrama no es correcto. Revisa las letras reveladas y la pista del poema.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 1: Usar la linterna UV</h3>
            <p className="text-gray-700">
              Los jugadores entran en un pasillo oscuro. En los estantes hay libros polvorientos numerados del 1 al 12.
            </p>
            <p className="text-gray-700">
              Se oyen susurros grabados que repiten un poema en un idioma arcaico.
            </p>

            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <div className="text-white mb-4">
                <h4 className="text-lg font-semibold mb-2">Pasillo Oscuro</h4>
                <p className="text-sm opacity-75">Libros numerados del 1 al 12 en los estantes</p>
              </div>
              
              <div className="grid grid-cols-6 gap-2 mb-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`w-12 h-16 border-2 rounded flex items-center justify-center text-white ${
                      uvLightOn ? 'border-purple-400 bg-purple-900' : 'border-gray-600 bg-gray-800'
                    }`}
                  >
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={toggleUVLight}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  uvLightOn
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {uvLightOn ? '🔦 Apagar UV' : '🔦 Encender UV'}
              </button>
            </div>

            <button
              onClick={() => setShowPoem(!showPoem)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showPoem ? 'Ocultar' : 'Escuchar'} Poema Susurrado
            </button>

            {showPoem && (
              <div className="bg-amber-100 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Poema Susurrado:</h4>
                <p className="text-gray-700 italic">"{whisperedPoem}"</p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 2: Recopilar letras reveladas</h3>
            <p className="text-gray-700">
              La luz UV ha revelado letras fluorescentes en los lomos de los libros.
            </p>

            <div className="bg-purple-100 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Letras Reveladas:</h4>
              <div className="grid grid-cols-6 gap-2">
                {uvLetters.map((uvLetter, index) => (
                  <div
                    key={index}
                    className="w-12 h-16 border-2 border-purple-400 bg-purple-200 rounded flex flex-col items-center justify-center"
                  >
                    <span className="text-xs text-purple-600">{uvLetter.bookNumber}</span>
                    <span className="text-lg font-bold text-purple-800">{uvLetter.letter}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Letras en orden:</h4>
              <div className="text-lg font-mono text-blue-600">
                {revealedLetters.join(' ')}
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Continuar al Anagrama
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 3: Resolver el anagrama</h3>
            <p className="text-gray-700">
              Reorganiza las letras para formar dos palabras de 6 letras cada una.
            </p>
            <p className="text-gray-700">
              Pista del poema: "{whisperedPoem}"
            </p>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Letras disponibles:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {revealedLetters.map((letter, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-blue-200 text-blue-800 rounded border-2 border-blue-300"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingresa la solución del anagrama (dos palabras de 6 letras):
              </label>
              <input
                type="text"
                value={anagramInput}
                onChange={(e) => setAnagramInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="EL SEÑOR CIPRÉS"
              />
            </div>

            <button
              onClick={handleAnagramSubmit}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Verificar Anagrama
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="p-6 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">¡Anagrama Resuelto!</h3>
              <p className="text-green-700">
                Has encontrado "EL SEÑOR CIPRÉS". En las baldas hay un libro con un ciprés dibujado en la portada.
              </p>
              <p className="text-green-700">
                Al sacarlo, encuentras un compartimento con un espejo circular grabado y un sobre sellado.
              </p>
            </div>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Contenido del sobre:</h4>
              <p className="text-gray-700">
                Una carta de la Dra. Reyes: "Si has llegado hasta aquí, sabes que el asesino no es quien piensas. 
                Busca el árbol en el corazón de la biblioteca."
              </p>
              <p className="text-gray-700">
                Además, un trozo de papel con la letra <strong>I</strong> dibujada en tinta UV.
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
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Luz negra y susurros</h2>
        <p className="text-gray-700">
          Los jugadores entran en un pasillo oscuro. En los estantes hay libros polvorientos numerados del 1 al 12.
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
          Paso {currentStep} de 4
        </div>
      </div>
    </div>
  );
}
