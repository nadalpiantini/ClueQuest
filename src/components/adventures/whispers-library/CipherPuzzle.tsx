'use client';

import { useState, useEffect } from 'react';
import { CipherData } from '@/data/adventures/whispers-library-data';

interface CipherPuzzleProps {
  cipherData: CipherData;
  onComplete: (solution: string) => void;
  onHint: () => void;
}

export default function CipherPuzzle({ cipherData, onComplete, onHint }: CipherPuzzleProps) {
  const [currentKey, setCurrentKey] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [chestCode, setChestCode] = useState('');
  const [showCipherWheel, setShowCipherWheel] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const vigenereDecrypt = (ciphertext: string, key: string): string => {
    const cleanCiphertext = ciphertext.replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    
    for (let i = 0; i < cleanCiphertext.length; i++) {
      const cipherChar = cleanCiphertext[i];
      const keyChar = cleanKey[i % cleanKey.length];
      
      const cipherIndex = alphabet.indexOf(cipherChar);
      const keyIndex = alphabet.indexOf(keyChar);
      
      const decryptedIndex = (cipherIndex - keyIndex + 26) % 26;
      result += alphabet[decryptedIndex];
    }
    
    return result;
  };

  const handleKeySubmit = () => {
    if (currentKey.toUpperCase() === cipherData.key) {
      const decrypted = vigenereDecrypt(cipherData.encryptedMessage, currentKey);
      setDecryptedMessage(decrypted);
      setCurrentStep(2);
    } else {
      alert('La clave no es correcta. Intenta con "ROSAS".');
    }
  };

  const handleChestCodeSubmit = () => {
    if (chestCode.toUpperCase() === 'ALA') {
      onComplete('ALA');
      setCurrentStep(3);
    } else {
      alert('El código del cofre no es correcto. Usa las primeras tres letras del mensaje descifrado.');
    }
  };

  const renderCipherWheel = () => (
    <div className="flex justify-center items-center space-x-8">
      <div className="relative w-32 h-32 border-4 border-amber-600 rounded-full bg-amber-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl font-bold text-amber-800">R</div>
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-amber-600"></div>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Rueda Cifradora</p>
        <p className="text-xs text-gray-500">Alinea R con A</p>
      </div>
      <div className="relative w-32 h-32 border-4 border-amber-600 rounded-full bg-amber-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl font-bold text-amber-800">A</div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 1: Encontrar la clave</h3>
            <p className="text-gray-700">
              Una nota del Dr. Black dice: "Las voces del pasado se oyen cuando las ordenamos. 
              Usa la rueda con prudencia".
            </p>
            <p className="text-gray-700">
              La clave secreta está escrita en la contraportada del manuscrito "Códigos y enigmas".
            </p>
            
            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Mensaje Cifrado:</h4>
              <div className="font-mono text-lg text-blue-600 bg-white p-3 rounded border">
                {cipherData.encryptedMessage}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingresa la clave (5 letras):
              </label>
              <input
                type="text"
                value={currentKey}
                onChange={(e) => setCurrentKey(e.target.value.toUpperCase())}
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="ROSAS"
              />
            </div>

            <button
              onClick={handleKeySubmit}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Descifrar Mensaje
            </button>

            <button
              onClick={() => setShowCipherWheel(!showCipherWheel)}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showCipherWheel ? 'Ocultar' : 'Mostrar'} Rueda Cifradora
            </button>

            {showCipherWheel && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                {renderCipherWheel()}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 2: Abrir el cofre</h3>
            <div className="bg-green-100 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Mensaje Descifrado:</h4>
              <div className="font-mono text-lg text-green-600 bg-white p-3 rounded border">
                {decryptedMessage}
              </div>
            </div>

            <p className="text-gray-700">
              El mensaje indica que a las cinco en punto se reunirán junto al relicario. 
              Usa las primeras tres letras para abrir el cofre.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Código del cofre (3 letras):
              </label>
              <input
                type="text"
                value={chestCode}
                onChange={(e) => setChestCode(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="ALA"
              />
            </div>

            <button
              onClick={handleChestCodeSubmit}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Abrir Cofre
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="p-6 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">¡Cofre Abierto!</h3>
              <p className="text-green-700">
                Dentro del cofre encuentras un reloj de bolsillo detenido a las 5:00 con la inscripción 
                "Eco de los susurros". También hay un cuaderno con un poema encriptado con la clave ALA.
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
        <h2 className="text-2xl font-bold text-amber-800 mb-2">El manuscrito cifrado</h2>
        <p className="text-gray-700">
          Llegan a una mesa donde se encuentra un manuscrito antiguo guardado en un cofre con combinación.
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
