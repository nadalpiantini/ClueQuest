'use client';

import WhispersLibraryAdventure from '@/components/adventures/whispers-library/WhispersLibraryAdventure';

export default function WhispersLibraryPage() {
  const handleAdventureComplete = (score: number, time: number) => {
    console.log('Adventure completed!', { score, time });
    alert(`¡Aventura completada!\nPuntuación: ${score}\nTiempo: ${Math.floor(time / 60)} minutos y ${time % 60} segundos`);
  };

  const handleSceneComplete = (sceneNumber: number, score: number) => {
    console.log('Scene completed!', { sceneNumber, score });
  };

  return (
    <WhispersLibraryAdventure
      onAdventureComplete={handleAdventureComplete}
      onSceneComplete={handleSceneComplete}
    />
  );
}