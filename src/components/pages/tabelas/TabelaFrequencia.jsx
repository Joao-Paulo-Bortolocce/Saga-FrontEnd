import { useState, useEffect , useContext} from 'react';
import { Search, DoorOpen } from 'lucide-react';
import { consultarTurmas } from "../../../service/servicoTurma";
import { ContextoUsuario } from '../../../App';

export default function TabelaFrequencia(props) {
  const [turmas, setTurmas] = useState([]);
  const [buscaSerie, setBuscaSerie] = useState("");
  const { setUsuario, usuario } = useContext(ContextoUsuario);

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
    const listaProf = lista.filter((turma)=>turma.profissional.profissional_usuario.includes(usuario.username))
    setTurmas(listaProf ?? []);
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
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lista de Turmas</h1>
            <p className="mt-2 text-sm text-gray-700">Lista de turmas disponíveis para seleção</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative">
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

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turma</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Série</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {turmas.length > 0 ? (
                  turmas.map((turma) => (
                    <tr key={turma.letra + turma.serie.serieId}>
                      <td className="px-6 py-4 whitespace-nowrap">{turma.letra}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{turma.serie.serieDescr}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => selecionarTurma(turma)}
                          className="text-indigo-600 hover:text-indigo-900"
                          aria-label="Selecionar Turma"
                        >
                          <DoorOpen className="h-5 w-5" />
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
