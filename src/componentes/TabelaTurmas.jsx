import { useState, useEffect } from 'react';
import { mockTurmas } from "./dados/mockTurmas.js";

export default function TabelaTurmas({ selecionarTurma }) {
  const [buscaSerie, setBuscaSerie] = useState("");
  const [turmasFiltradas, setTurmasFiltradas] = useState([]);

  useEffect(() => {
    setTurmasFiltradas(mockTurmas);
  }, []);

  useEffect(() => {
    const filtradas = mockTurmas.filter(turma =>
      turma.serie.toLowerCase().includes(buscaSerie.toLowerCase())
    );
    setTurmasFiltradas(filtradas);
  }, [buscaSerie]);

  return (
    <div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Buscar por série..."
          value={buscaSerie}
          onChange={(e) => setBuscaSerie(e.target.value)}
          className="w-full border border-black bg-black text-white p-2"
        />
      </div>
      <table className="w-full border border-black bg-black">
        <thead className="bg-gray-500">
          <tr>
            <th className="p-3 text-black">Turma</th>
            <th className="p-3 text-black">Série</th>
            <th className="p-3 text-black">Ação</th>
          </tr>
        </thead>
        <tbody>
          {turmasFiltradas.map((turma) => (
            <tr key={turma.letra + turma.serie} className="border-t border-gray-700">
              <td className="p-3 text-center">{turma.letra}</td>
              <td className="p-3 text-center">{turma.serie}</td>
              <td className="p-3 text-center flex gap-2 justify-center">
                <button
                  onClick={() => selecionarTurma(turma)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded"
                >
                  Selecionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
