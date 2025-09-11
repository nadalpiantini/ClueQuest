'use client';

import { useState, useEffect } from 'react';
import { LibraryCard } from '@/data/adventures/whispers-library-data';

interface LibraryCardPuzzleProps {
  cards: LibraryCard[];
  onComplete: (solution: string) => void;
  onHint: () => void;
}

export default function LibraryCardPuzzle({ cards, onComplete, onHint }: LibraryCardPuzzleProps) {
  const [sortedCards, setSortedCards] = useState<LibraryCard[]>([]);
  const [draggedCard, setDraggedCard] = useState<LibraryCard | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [extractedDigits, setExtractedDigits] = useState<number[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [translatedWord, setTranslatedWord] = useState('');

  // Initialize with shuffled cards
  useEffect(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setSortedCards(shuffled);
  }, [cards]);

  const handleDragStart = (e: React.DragEvent, card: LibraryCard) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedCard) return;

    const newSortedCards = [...sortedCards];
    const draggedIndex = newSortedCards.findIndex(card => card.letter === draggedCard.letter);
    
    if (draggedIndex !== -1) {
      newSortedCards.splice(draggedIndex, 1);
      newSortedCards.splice(targetIndex, 0, draggedCard);
      setSortedCards(newSortedCards);
    }
    
    setDraggedCard(null);
  };

  const checkSorting = () => {
    const correctOrder = cards.sort((a, b) => a.author.localeCompare(b.author));
    const isCorrect = sortedCards.every((card, index) => card.letter === correctOrder[index].letter);
    
    if (isCorrect) {
      setCurrentStep(2);
      extractSecondDigits();
    } else {
      alert('El orden no es correcto. Revisa el orden alfabético de los autores.');
    }
  };

  const extractSecondDigits = () => {
    const digits = sortedCards.map(card => {
      const callNumber = card.callNumber;
      const numbers = callNumber.match(/\d/g);
      return numbers ? parseInt(numbers[1]) : 0;
    });
    setExtractedDigits(digits);
    setPhoneNumber(digits.join(''));
    setCurrentStep(3);
  };

  const translatePhoneNumber = () => {
    const phoneToLetters: { [key: string]: string } = {
      '2': 'ABC', '3': 'DEF', '4': 'GHI', '5': 'JKL',
      '6': 'MNO', '7': 'PQRS', '8': 'TUV', '9': 'WXYZ', '0': ' '
    };
    
    let word = '';
    for (const digit of phoneNumber) {
      if (digit === '0') {
        word += ' ';
      } else {
        const letters = phoneToLetters[digit];
        if (letters) {
          word += letters[0]; // Take first letter of each group
        }
      }
    }
    
    setTranslatedWord(word.trim());
    setCurrentStep(4);
  };

  const findTargetBook = () => {
    if (translatedWord.includes('MANUSCR')) {
      const targetBook = cards.find(card => card.title.includes('Códigos'));
      if (targetBook) {
        onComplete('MANUSCRITO');
        setCurrentStep(5);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 1: Ordenar las tarjetas</h3>
            <p className="text-gray-700">Ordena las tarjetas alfabéticamente por apellido del autor:</p>
            <div className="grid grid-cols-4 gap-2">
              {sortedCards.map((card, index) => (
                <div
                  key={card.letter}
                  className="p-3 border-2 border-amber-300 rounded-lg bg-amber-50 cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, card)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="text-sm font-bold text-amber-800">{card.letter}</div>
                  <div className="text-xs text-gray-600">{card.author}</div>
                  <div className="text-xs text-gray-500">{card.title}</div>
                  <div className="text-xs font-mono text-blue-600">{card.callNumber}</div>
                </div>
              ))}
            </div>
            <button
              onClick={checkSorting}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Verificar Orden
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 2: Extraer dígitos</h3>
            <p className="text-gray-700">Toma el segundo dígito de cada código de clasificación:</p>
            <div className="grid grid-cols-4 gap-2">
              {sortedCards.map((card, index) => {
                const callNumber = card.callNumber;
                const numbers = callNumber.match(/\d/g);
                const secondDigit = numbers ? numbers[1] : '0';
                return (
                  <div key={card.letter} className="p-3 border border-amber-300 rounded bg-amber-50">
                    <div className="text-sm font-bold text-amber-800">{card.letter}</div>
                    <div className="text-xs font-mono text-blue-600">{card.callNumber}</div>
                    <div className="text-lg font-bold text-red-600 mt-1">{secondDigit}</div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={extractSecondDigits}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Extraer Dígitos
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 3: Formar número telefónico</h3>
            <p className="text-gray-700">Dígitos extraídos: {extractedDigits.join(', ')}</p>
            <div className="text-2xl font-mono text-blue-600 bg-gray-100 p-4 rounded">
              {phoneNumber}
            </div>
            <button
              onClick={translatePhoneNumber}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Traducir a Letras
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 4: Buscar el libro</h3>
            <p className="text-gray-700">Palabra traducida: <strong>{translatedWord}</strong></p>
            <p className="text-gray-700">Busca el libro cuyo título contenga una palabra relacionada:</p>
            <div className="grid grid-cols-2 gap-2">
              {cards.map(card => (
                <div key={card.letter} className="p-3 border border-amber-300 rounded bg-amber-50">
                  <div className="text-sm font-bold text-amber-800">{card.author}</div>
                  <div className="text-xs text-gray-600">{card.title}</div>
                </div>
              ))}
            </div>
            <button
              onClick={findTargetBook}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Encontrar Libro Objetivo
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="p-6 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">¡Puzzle Completado!</h3>
              <p className="text-green-700">Has encontrado el libro "Códigos y enigmas" de Grimaldi.</p>
              <p className="text-green-700">Dentro hay una carpeta con una nota: "Buen comienzo. Los manuscritos esconden más respuestas."</p>
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
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Registro y el archivo de tarjetas</h2>
        <p className="text-gray-700">
          Una nota del bibliotecario Sloane dice: "Cada libro tiene un lugar y cada lugar guarda un secreto. 
          Empieza por ordenar las mentes y hallarás la verdad."
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
