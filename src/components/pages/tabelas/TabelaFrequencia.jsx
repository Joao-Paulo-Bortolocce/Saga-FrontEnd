import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { consultarTurmas } from "../../../service/serviceTurma.js";

export default function TabelaFrequencia(props) {
  const [turmas, setTurmas] = useState([]);
  const [buscaSerie, setBuscaSerie] = useState("");

  useEffect(() => {
    buscarTurma();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      buscarPorSerie(buscaSerie);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [buscaSerie]);

  async function buscarTurma() {
    const lista = await consultarTurmas();
    setTurmas(lista ?? []);
  }

  async function buscarPorSerie(termo) {
    if (!termo.trim()) return buscarTurma();

    const turmasFiltradas = turmas.filter((turma) =>
      turma.serie.serieDescr.toLowerCase().includes(termo.toLowerCase())
    );
    setTurmas(turmasFiltradas ?? []);
  }

  function selecionarTurma(turma) {
    props.setTurma(turma);
    props.setExibirTabela(false);
  }

  return (
    <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Lista de Turmas</h2>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por série..."
              value={buscaSerie}
              onChange={(e) => setBuscaSerie(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-white divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Turma</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Série</th>
                  <th className="px-6 py-3 text-right text-sm font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {turmas.length > 0 ? (
                  turmas.map((turma) => (
                    <tr key={turma.letra + turma.serie.serieId}>
                      <td className="px-6 py-4">{turma.letra}</td>
                      <td className="px-6 py-4">{turma.serie.serieDescr}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => selecionarTurma(turma)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                        >
                          Selecionar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-red-500">Nenhuma turma encontrada!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
