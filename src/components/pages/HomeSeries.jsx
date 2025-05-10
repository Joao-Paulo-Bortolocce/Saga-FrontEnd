import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import logoPrefeitura from '../../assets/images/logoPrefeitura.png'
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
    const serie = {
      serieNum: Number(serieNum),
      serieDescr: descricao,
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
    if (/\d/.test(termo)) {
      toast.error("A busca deve conter apenas letras, sem números.", { duration: 2000 });
    }
    else {
      setBusca(termo);
      const lista = await servicoSerie.consultarSerie(termo);
      setSeries(lista ?? []);
    }
  }

  return (
    <div>
      <Toaster position="top-center" />
      <Page />
      <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-4xl px-4 space-y-8">
          {!mostrarFormulario && (
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Séries Cadastradas</h2>
                <button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg">
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
                    className="w-full px-4 py-2 pl-10 border border-gray-700 rounded-lg bg-gray-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Número</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Descrição</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800/40">
                    {series.map((serie, index) => (
                      <tr key={index} className="hover:bg-gray-700/40 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-300">{serie.serieId}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{serie.serieNum}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{serie.serieDescr}</td>
                        <td className="px-6 py-4 text-sm text-gray-300 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => editarSerie(serie)} className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-400">Editar</button>
                            <button onClick={() => excluirSerie(serie)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400">Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {series.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-red-400 py-4">Nenhuma série encontrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {mostrarFormulario && (
            <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
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
                    <label htmlFor="serieNum" className="text-sm font-medium text-white mb-1">Número da Série</label>
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
                    <label htmlFor="descricao" className="text-sm font-medium text-white mb-1">Descrição</label>
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
                <button type="submit" className="w-full bg-green-700 hover:bg-green-800 transition-colors text-white py-2 px-4 rounded-lg">
                  {serieEmEdicao ? 'Atualizar' : 'Cadastrar'}
                </button>
                <button type="button" onClick={cancelarEdicao} className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
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
