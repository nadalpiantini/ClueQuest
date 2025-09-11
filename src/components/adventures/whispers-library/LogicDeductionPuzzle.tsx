'use client';

import { useState, useEffect } from 'react';
import { LogicClue } from '@/data/adventures/whispers-library-data';

interface LogicDeductionPuzzleProps {
  logicClues: LogicClue[];
  logicSolution: any;
  onComplete: (solution: string) => void;
  onHint: () => void;
}

interface LogicGrid {
  [key: string]: {
    time: string;
    location: string;
    activity: string;
  };
}

export default function LogicDeductionPuzzle({ logicClues, logicSolution, onComplete, onHint }: LogicDeductionPuzzleProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [logicGrid, setLogicGrid] = useState<LogicGrid>({});
  const [selectedCell, setSelectedCell] = useState<{suspect: string, category: string} | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const suspects = ['Reyes', 'Sloane', 'Black', 'Clara', 'Henry'];
  const times = ['4 p.m.', '5 p.m.', '6 p.m.'];
  const locations = ['Microfilms', 'Colección general', 'Sección de mapas', 'Sección de manuscritos', 'Depósito de periódicos'];
  const activities = ['Pergamino', 'Diario secreto', 'Manuscrito escondido', 'Libro raro'];

  const initializeGrid = () => {
    const grid: LogicGrid = {};
    suspects.forEach(suspect => {
      grid[suspect] = {
        time: '',
        location: '',
        activity: ''
      };
    });
    setLogicGrid(grid);
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  const handleCellClick = (suspect: string, category: string) => {
    setSelectedCell({ suspect, category });
  };

  const handleValueSelect = (value: string) => {
    if (selectedCell) {
      setLogicGrid(prev => ({
        ...prev,
        [selectedCell.suspect]: {
          ...prev[selectedCell.suspect],
          [selectedCell.category]: value
        }
      }));
      setSelectedCell(null);
    }
  };

  const checkSolution = () => {
    const isCorrect = suspects.every(suspect => {
      const solution = logicSolution[suspect];
      const current = logicGrid[suspect];
      return current.time === solution.time && 
             current.location === solution.location && 
             current.activity === solution.activity;
    });

    if (isCorrect) {
      setCurrentStep(2);
    } else {
      alert('La solución no es correcta. Revisa tus deducciones.');
    }
  };

  const generatePigpenCode = () => {
    const locations = ['Microfilms', 'Colección general', 'Sección de mapas', 'Sección de manuscritos', 'Depósito de periódicos'];
    const timeOrder = ['4 p.m.', '5 p.m.', '5 p.m.', '6 p.m.', '4 p.m.'];
    
    const orderedLocations = timeOrder.map((time, index) => {
      const suspect = suspects.find(s => logicGrid[s]?.time === time);
      return suspect ? logicGrid[suspect].location : '';
    });

    const initials = orderedLocations.map(loc => loc.split(' ')[0][0]).join('');
    return initials; // MCSSD
  };

  const renderLogicGrid = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-amber-100">
            <th className="border border-gray-300 p-2 text-left">Suspect</th>
            <th className="border border-gray-300 p-2 text-left">Hora</th>
            <th className="border border-gray-300 p-2 text-left">Sección</th>
            <th className="border border-gray-300 p-2 text-left">Actividad</th>
          </tr>
        </thead>
        <tbody>
          {suspects.map(suspect => (
            <tr key={suspect} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">{suspect}</td>
              <td 
                className={`border border-gray-300 p-2 cursor-pointer ${
                  selectedCell?.suspect === suspect && selectedCell?.category === 'time' ? 'bg-blue-200' : ''
                }`}
                onClick={() => handleCellClick(suspect, 'time')}
              >
                {logicGrid[suspect]?.time || '?'}
              </td>
              <td 
                className={`border border-gray-300 p-2 cursor-pointer ${
                  selectedCell?.suspect === suspect && selectedCell?.category === 'location' ? 'bg-blue-200' : ''
                }`}
                onClick={() => handleCellClick(suspect, 'location')}
              >
                {logicGrid[suspect]?.location || '?'}
              </td>
              <td 
                className={`border border-gray-300 p-2 cursor-pointer ${
                  selectedCell?.suspect === suspect && selectedCell?.category === 'activity' ? 'bg-blue-200' : ''
                }`}
                onClick={() => handleCellClick(suspect, 'activity')}
              >
                {logicGrid[suspect]?.activity || '?'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderValueSelector = () => {
    if (!selectedCell) return null;

    let values: string[] = [];
    switch (selectedCell.category) {
      case 'time':
        values = times;
        break;
      case 'location':
        values = locations;
        break;
      case 'activity':
        values = activities;
        break;
    }

    return (
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          Selecciona valor para {selectedCell.suspect} - {selectedCell.category}:
        </h4>
        <div className="flex flex-wrap gap-2">
          {values.map(value => (
            <button
              key={value}
              onClick={() => handleValueSelect(value)}
              className="px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
            >
              {value}
            </button>
          ))}
          <button
            onClick={() => setSelectedCell(null)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 1: Resolver el puzzle de lógica</h3>
            <p className="text-gray-700">
              En el tronco del árbol hay cinco tablillas de madera con afirmaciones sobre dónde estaban los sospechosos.
            </p>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Pistas disponibles:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {logicClues.map((clue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="font-semibold text-amber-600 mr-2">•</span>
                    <span>{clue.statement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-800 mb-2">Tablero de lógica:</h4>
              {renderLogicGrid()}
              {renderValueSelector()}
            </div>

            <button
              onClick={checkSolution}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Verificar Solución
            </button>

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showSolution ? 'Ocultar' : 'Mostrar'} Solución
            </button>

            {showSolution && (
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Solución:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-green-200">
                        <th className="border border-gray-300 p-2 text-left">Suspect</th>
                        <th className="border border-gray-300 p-2 text-left">Hora</th>
                        <th className="border border-gray-300 p-2 text-left">Sección</th>
                        <th className="border border-gray-300 p-2 text-left">Actividad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(logicSolution).map(([suspect, data]: [string, any]) => (
                        <tr key={suspect}>
                          <td className="border border-gray-300 p-2 font-semibold">{suspect}</td>
                          <td className="border border-gray-300 p-2">{data.time}</td>
                          <td className="border border-gray-300 p-2">{data.location}</td>
                          <td className="border border-gray-300 p-2">{data.activity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Paso 2: Generar código Pigpen</h3>
            <p className="text-gray-700">
              Ahora toma las primeras letras de las secciones en orden de horas para formar el código.
            </p>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Orden por horas:</h4>
              <div className="space-y-2">
                {['4 p.m.', '5 p.m.', '5 p.m.', '6 p.m.', '4 p.m.'].map((time, index) => {
                  const suspect = suspects.find(s => logicGrid[s]?.time === time);
                  const location = suspect ? logicGrid[suspect].location : '';
                  const initial = location ? location.split(' ')[0][0] : '?';
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="font-semibold">{time}</span>
                      <span>→</span>
                      <span>{location}</span>
                      <span className="font-bold text-blue-600">({initial})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Código Pigpen:</h4>
              <div className="text-2xl font-mono text-blue-600">
                {generatePigpenCode()}
              </div>
            </div>

            <button
              onClick={() => onComplete(generatePigpenCode())}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Usar Código en el Árbol
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-amber-50 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-amber-800 mb-2">El árbol del conocimiento</h2>
        <p className="text-gray-700">
          En el tronco del árbol hay cinco tablillas de madera, cada una con afirmaciones sobre dónde estaban los sospechosos.
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
          Paso {currentStep} de 2
        </div>
      </div>
    </div>
  );
}
