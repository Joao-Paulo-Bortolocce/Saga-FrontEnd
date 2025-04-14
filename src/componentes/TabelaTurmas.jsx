import { useState, useEffect } from 'react';
import { mockTurmas } from "./dados/mockTurmas.js";

export default function TabelaTurmas({ selecionarTurma }) {
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    setTurmas(mockTurmas); // Simula a consulta
  }, []);

  return (
    <table className="w-full border border-black bg-black">
      <thead className="bg-gray-500">
        <tr>
          <th className="p-3 text-black">Turma</th>
          <th className="p-3 text-black">Série</th>
          <th className="p-3 text-black">Ação</th>
        </tr>
      </thead>
      <tbody>
        {turmas.map((turma) => (
          <tr key={turma.letra} className="border-t border-gray-700">
            <td className="p-3 text-center">{turma.letra}</td>
            <td className="p-3 text-center">{turma.serie}</td>
            <td className="p-3 text-center flex gap-2 justify-center">
              <button onClick={() => selecionarTurma(turma)}  
              className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded">
                Selecionar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
