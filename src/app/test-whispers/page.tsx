'use client';

import { useState } from 'react';
import WhispersLibraryAdventure from '@/components/adventures/whispers-library/WhispersLibraryAdventure';

export default function TestWhispersPage() {
  const [adventureComplete, setAdventureComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  const handleAdventureComplete = (score: number, time: number) => {
    setFinalScore(score);
    setFinalTime(time);
    setAdventureComplete(true);
    console.log(`Adventure completed! Score: ${score}, Time: ${time} seconds`);
  };

  const handleSceneComplete = (sceneNumber: number, score: number) => {
    console.log(`Scene ${sceneNumber} completed with score: ${score}`);
  };

  if (adventureComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">¡Aventura Completada!</h1>
          <p className="text-xl text-gray-700 mb-6">
            Has resuelto exitosamente "Whispers in the Library"
          </p>
          <div className="bg-green-100 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Resultados Finales</h2>
            <p className="text-lg text-gray-700">Puntuación: <span className="font-bold text-green-600">{finalScore}</span></p>
            <p className="text-lg text-gray-700">Tiempo: <span className="font-bold text-green-600">{Math.floor(finalTime / 60)} minutos {finalTime % 60} segundos</span></p>
          </div>
          <button
            onClick={() => {
              setAdventureComplete(false);
              setFinalScore(0);
              setFinalTime(0);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <WhispersLibraryAdventure
        onAdventureComplete={handleAdventureComplete}
        onSceneComplete={handleSceneComplete}
      />
    </div>
  );
}
