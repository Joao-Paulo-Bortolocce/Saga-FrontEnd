import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import logoPrefeitura from '../../assets/images/logoPrefeitura.png';
import Page from '../layouts/Page.jsx';
import * as servicoSerie from '../../service/servicoSerie.js';

export default function HomeSeries() {
  const [series, setSeries] = useState([]);
  const [serieEmEdicao, setSerieEmEdicao] = useState(null);
  const [serieNum, setSerieNum] = useState('');
  const [descricao, setDescricao] = useState('');
  const [busca, setBusca] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    buscarSeries();
  }, []);

  async function buscarSeries() {
    const lista = await servicoSerie.consultarSerie();
    setSeries(lista ?? []);
  }

  async function excluirSerie(serie) {
    toast.promise(
      servicoSerie.excluirSerie(serie).then((res) => {
        if (res.status) {
          buscarSeries();
        } else {
          throw new Error(res.mensagem || 'Erro ao excluir');
        }
      }),
      {
        loading: 'Excluindo...',
        success: 'Série excluída com sucesso!',
        error: 'Erro ao excluir série',
      }
    );
  }

  function editarSerie(serie) {
    setSerieEmEdicao(serie);
    setSerieNum(serie.serieNum);
    setDescricao(serie.serieDescr);
    setMostrarFormulario(true);
    toast('Você está alterando uma série!', { icon: '⚠️' });
  }

  function cancelarEdicao() {
    setSerieEmEdicao(null);
    setSerieNum('');
    setDescricao('');
    setMostrarFormulario(false);
  }

  async function salvarSerie(e) {
    e.preventDefault();
  
    // Validação manual dos campos
    if (!serieNum || Number(serieNum) <= 0) {
      toast.error("Informe um número de série válido!");
      return;
    }
  
    if (!descricao.trim()) {
      toast.error("A descrição não pode estar vazia!");
      return;
    }
  
    const serie = {
      serieNum: Number(serieNum),
      serieDescr: descricao.trim(),
      id: serieEmEdicao?.id,
    };
  
    const acao = serieEmEdicao
      ? servicoSerie.alterarSerie(serieEmEdicao.serieId, serie)
      : servicoSerie.gravarSerie(serie);
  
    toast.promise(
      acao.then(() => {
        buscarSeries();
        cancelarEdicao();
      }),
      {
        loading: serieEmEdicao ? 'Atualizando...' : 'Cadastrando...',
        success: serieEmEdicao ? 'Série atualizada!' : 'Série cadastrada!',
        error: 'Erro ao salvar',
      }
    );
  }

  async function buscarPorDescricao(termo) {
    setBusca(termo);
    const lista = await servicoSerie.consultarSerie(termo);
    setSeries(lista ?? []);
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}
    >
      <Toaster position="top-center" />
      <Page />

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-4xl px-4 space-y-8">
          {!mostrarFormulario && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full border border-gray-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Séries Cadastradas</h2>
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
                >
                  <Plus className="w-4 h-4" /> Cadastrar
                </button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por descrição..."
                    value={busca}
                    onChange={(e) => buscarPorDescricao(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-300">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase">Número</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase">Descrição</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-black uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {series.map((serie) => (
                      <tr key={serie.serieId} className="hover:bg-gray-100 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-black">{serie.serieId}</td>
                        <td className="px-6 py-4 text-sm text-black">{serie.serieNum}</td>
                        <td className="px-6 py-4 text-sm text-black">{serie.serieDescr}</td>
                        <td className="px-6 py-4 text-sm text-black text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => editarSerie(serie)}
                              className="p-1.5 text-blue-600 hover:text-blue-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button
                              onClick={() => excluirSerie(serie)}
                              className="p-1.5 text-red-400 hover:text-red-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {series.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-red-600 py-4">
                          Nenhuma série encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {mostrarFormulario && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-gray-300">
              <h2 className="text-2xl font-bold text-black mb-4 text-center">
                {serieEmEdicao ? 'Editar Série' : 'Cadastro de Série'}
              </h2>

              <div className="flex justify-center mb-6">
                <img
                  src={logoPrefeitura}
                  alt="Logo da Prefeitura"
                  className="h-24 w-auto"
                />
              </div>

              <form onSubmit={salvarSerie} className="space-y-6" noValidate>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="serieNum"
                      className="text-sm font-medium text-black mb-1"
                    >
                      Número da Série
                    </label>
                    <input
                      type="number"
                      id="serieNum"
                      value={serieNum}
                      onChange={(e) => setSerieNum(e.target.value)}
                      placeholder="Digite o número"
                      className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="descricao"
                      className="text-sm font-medium text-black mb-1"
                    >
                      Descrição
                    </label>
                    <input
                      type="text"
                      id="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Digite a descrição"
                      className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-2 px-4 rounded-lg"
                >
                  {serieEmEdicao ? 'Atualizar' : 'Cadastrar'}
                </button>

                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}