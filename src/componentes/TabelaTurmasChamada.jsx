import { useState, useEffect } from 'react';
import { consultarTurmas } from "../service/servicoTurma.js";

export default function TabelaTurmasChamada({ selecionarTurma }) {
  const [turmas, setTurmas] = useState([]);
  const [buscaSerie, setBuscaSerie] = useState("");

  useEffect(() => {
    buscarTurma();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      buscarPorSerie(buscaSerie);
    },);

    return () => clearTimeout(delayDebounce);
  }, [buscaSerie]);

  async function buscarTurma() {
    const lista = await consultarTurmas();
    setTurmas(lista ?? []);
  }

  async function buscarPorSerie(termo) {
    if (!termo || termo.trim() === "") {
      buscarTurma();
    }
    else{
      const turmasFiltradas = turmas.filter((turma) =>
        turma.serie.serieDescr.toLowerCase().includes(buscaSerie.toLowerCase())
      );
      setTurmas(turmasFiltradas ?? []);
    }
  }

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
          {(turmas ?? []).length > 0 ? (
            turmas.map((turma) => (
              <tr key={turma.letra+turma.serie.serieId} className="border-t border-gray-700">
                <td className="p-3 text-center">{turma.letra}</td>
                <td className="p-3 text-center">{turma.serie.serieDescr}</td>
                <td className="p-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => selecionarTurma(turma)}
                    className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded"
                  >
                    Selecionar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center text-red-600">
                Nenhuma turma encontrada!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
