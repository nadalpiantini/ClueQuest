'use client';

import { useState, useEffect } from 'react';
import LibraryCardPuzzle from './LibraryCardPuzzle';
import CipherPuzzle from './CipherPuzzle';
import MorsePoemPuzzle from './MorsePoemPuzzle';
import UVAnagramPuzzle from './UVAnagramPuzzle';
import LogicDeductionPuzzle from './LogicDeductionPuzzle';
import FinalWordPuzzle from './FinalWordPuzzle';
import {
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
  requiredMaterials
} from '@/data/adventures/whispers-library-data';

interface WhispersLibraryAdventureProps {
  onAdventureComplete: (score: number, time: number) => void;
  onSceneComplete: (sceneNumber: number, score: number) => void;
}

export default function WhispersLibraryAdventure({ onAdventureComplete, onSceneComplete }: WhispersLibraryAdventureProps) {
  const [currentScene, setCurrentScene] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showMaterials, setShowMaterials] = useState(false);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const handleSceneComplete = (sceneNumber: number, solution: string, score: number = 100) => {
    setTotalScore(prev => prev + score);
    onSceneComplete(sceneNumber, score);
    
    // Collect letters from each scene
    const letterMap: { [key: number]: string } = {
      1: 'M', // Manuscrito
      2: 'A', // Ala
      3: 'P', // Pergamino
      4: 'L', // Mapa
      5: 'I', // Espejo
      6: 'B', // Pluma
      7: 'R', // Alias
      8: 'O'  // Nota
    };
    
    if (letterMap[sceneNumber]) {
      setCollectedLetters(prev => [...prev, letterMap[sceneNumber]]);
    }
    
    // Move to next scene
    if (sceneNumber < 8) {
      setCurrentScene(sceneNumber + 1);
    } else {
      // Adventure completed
      const endTime = new Date();
      const totalTime = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      onAdventureComplete(totalScore, totalTime);
    }
  };

  const handleHint = () => {
    // Implement hint system
    console.log('Hint requested for scene', currentScene);
  };

  const renderScene = () => {
    switch (currentScene) {
      case 1:
        return (
          <LibraryCardPuzzle
            cards={libraryCards}
            onComplete={(solution) => handleSceneComplete(1, solution, 150)}
            onHint={handleHint}
          />
        );
      case 2:
        return (
          <CipherPuzzle
            cipherData={cipherData}
            onComplete={(solution) => handleSceneComplete(2, solution, 200)}
            onHint={handleHint}
          />
        );
      case 3:
        return (
          <MorsePoemPuzzle
            morseData={morseData}
            letterGrid={letterGrid}
            onComplete={(solution) => handleSceneComplete(3, solution, 175)}
            onHint={handleHint}
          />
        );
      case 4:
        return (
          <div className="max-w-4xl mx-auto p-6 bg-amber-50 rounded-lg shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">El mapa y la sección prohibida</h2>
              <p className="text-gray-700">
                El mapa encontrado en la escena anterior muestra un recorrido entre los pasillos. 
                Sin embargo, le falta una pieza en la esquina.
              </p>
            </div>
            <div className="p-6 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Puzzle de Riddle</h3>
              <p className="text-green-700">
                Este puzzle requiere resolver el acertijo sobre los ocho centinelas silenciosos.
                La solución es: {riddleData.solution}
              </p>
              <button
                onClick={() => handleSceneComplete(4, riddleData.solution, 200)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Completar Escena 4
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <UVAnagramPuzzle
            uvLetters={uvLetters}
            whisperedPoem={whisperedPoem}
            anagramSolution={anagramSolution}
            onComplete={(solution) => handleSceneComplete(5, solution, 225)}
            onHint={handleHint}
          />
        );
      case 6:
        return (
          <LogicDeductionPuzzle
            logicClues={logicClues}
            logicSolution={logicSolution}
            onComplete={(solution) => handleSceneComplete(6, solution, 250)}
            onHint={handleHint}
          />
        );
      case 7:
        return (
          <div className="max-w-4xl mx-auto p-6 bg-amber-50 rounded-lg shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Microfilms y el susurro del fantasma</h2>
              <p className="text-gray-700">
                Los jugadores encuentran un microfilm etiquetado como "Confesión". 
                Al reproducirlo, escuchan una voz distorsionada recitando un verso.
              </p>
            </div>
            <div className="p-6 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Puzzle de Acróstico</h3>
              <p className="text-green-700">
                Este puzzle requiere decodificar el acróstico del poema y resolver el patrón numérico.
                La solución es: {microfilmData.solution}
              </p>
              <button
                onClick={() => handleSceneComplete(7, microfilmData.solution, 200)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Completar Escena 7
              </button>
            </div>
          </div>
        );
      case 8:
        return (
          <FinalWordPuzzle
            finalLetters={finalLetters}
            finalWordSolution={finalWordSolution}
            onComplete={(solution) => handleSceneComplete(8, solution, 300)}
            onHint={handleHint}
          />
        );
      default:
        return null;
    }
  };

  const renderIntro = () => (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-800 mb-4">Whispers in the Library</h1>
        <p className="text-xl text-gray-700 italic">
          "En las sombras de la Biblioteca Monteverde ha ocurrido un crimen..."
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">Sinopsis</h2>
        <p className="text-gray-700 mb-4">
          En las sombras de la Biblioteca Monteverde —una institución centenaria con una colección de grimorios, 
          incunables y cartas prohibidas— ha ocurrido un crimen. Un investigador ha sido hallado sin vida entre 
          las estanterías y un único testigo ha desaparecido. Los viejos libros susurran secretos que solo las 
          mentes curiosas podrán descifrar.
        </p>
        <p className="text-gray-700">
          El reloj avanza; el asesino podría atacar de nuevo si no descubres su identidad.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-amber-800 mb-3">Personajes</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {Object.entries(characters).map(([key, character]: [string, any]) => (
              <li key={key}>
                <span className="font-semibold">{character.name}:</span> {character.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-amber-800 mb-3">Información de la Aventura</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><span className="font-semibold">Duración estimada:</span> 90 minutos</li>
            <li><span className="font-semibold">Dificultad:</span> Intermedia</li>
            <li><span className="font-semibold">Jugadores:</span> 2-4</li>
            <li><span className="font-semibold">Escenas:</span> 8</li>
            <li><span className="font-semibold">Tipo:</span> Escape Room Narrativo</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowMaterials(!showMaterials)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showMaterials ? 'Ocultar' : 'Ver'} Materiales
        </button>
        <button
          onClick={() => setShowIntro(false)}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          Comenzar Aventura
        </button>
      </div>

      {showMaterials && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-amber-800 mb-3">Materiales Requeridos</h3>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
            {requiredMaterials.map((material, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>{material}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (showIntro) {
    return renderIntro();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-amber-800">
              Escena {currentScene} de 8
            </h2>
            <div className="text-sm text-gray-600">
              Puntuación: {totalScore} | Letras: {collectedLetters.join('')}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-amber-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentScene / 8) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Scene Content */}
        {renderScene()}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentScene(Math.max(1, currentScene - 1))}
            disabled={currentScene === 1}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Escena Anterior
          </button>
          <button
            onClick={() => setShowIntro(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver al Inicio
          </button>
          <button
            onClick={() => setCurrentScene(Math.min(8, currentScene + 1))}
            disabled={currentScene === 8}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Siguiente Escena
          </button>
        </div>
      </div>
    </div>
  );
}
