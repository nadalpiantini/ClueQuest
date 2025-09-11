'use client';

import { } from 'react';
import WhispersLibraryAdventure from '@/components/adventures/whispers-library/WhispersLibraryAdventure';

export default function WhispersLibraryPage() {
  const handleAdventureComplete = (score: number, time: number) => {
    console.log(`Adventure completed! Score: ${score}, Time: ${time} seconds`);
    // Here you would typically save the results to a database
    // or show a completion screen
  };

  const handleSceneComplete = (sceneNumber: number, score: number) => {
    console.log(`Scene ${sceneNumber} completed with score: ${score}`);
    // Here you would typically update progress tracking
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <WhispersLibraryAdventure
        onAdventureComplete={handleAdventureComplete}
        onSceneComplete={handleSceneComplete}
      />
    </div>
  );
}
