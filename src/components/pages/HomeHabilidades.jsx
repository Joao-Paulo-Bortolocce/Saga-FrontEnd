import { useState, useEffect } from 'react';
import { Trash2, Pencil, Search, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import logoPrefeitura from '../../assets/images/logoPrefeitura.png'
import Page from '../layouts/Page.jsx';
import * as servicoHabilidade from '../../service/serviceHabilidade.js';
import * as servicoMateria from '../../service/serviceMateria.js';
import * as servicoSerie from '../../service/servicoSerie.js';

export default function HomeHabilidades() {
  const [habilidades, setHabilidades] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [series, setSeries] = useState([]);
  const [habilidadeEmEdicao, setHabilidadeEmEdicao] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [serieId, setSerieId] = useState('');
  const [busca, setBusca] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [materiasRes, seriesRes] = await Promise.all([
        servicoMateria.consultarMateria(),
        servicoSerie.buscarSeries()
      ]);
      
      setMaterias(materiasRes.listaDeMaterias || []);
      setSeries(seriesRes.series || []);
      
      // Carregar todas as habilidades inicialmente
      if (materiasRes.listaDeMaterias?.length > 0) {
        const habilidadesRes = await servicoHabilidade.consultarHabMat(materiasRes.listaDeMaterias[0].id);
        setHabilidades(habilidadesRes.listaDeHabilidades || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    }
  }

  async function buscarTodasHabilidades() {
    try {
      if (materias.length > 0) {
        const habilidadesRes = await servicoHabilidade.consultarHabMat(materias[0].id);
        setHabilidades(habilidadesRes.listaDeHabilidades || []);
      }
    } catch (error) {
      console.error('Erro ao buscar habilidades:', error);
    }
  }

  async function excluirHabilidade(habilidade) {
    toast.promise(
      servicoHabilidade.apagarHabilidade(habilidade.cod).then((res) => {
        if (res.status) {
          buscarTodasHabilidades();
        } else {
          throw new Error(res.mensagem || 'Erro ao excluir');
        }
      }),
      {
        loading: 'Excluindo...',
        success: 'Habilidade excluída com sucesso!',
        error: 'Erro ao excluir habilidade',
      }
    );
  }

  function editarHabilidade(habilidade) {
    setHabilidadeEmEdicao(habilidade);
    setDescricao(habilidade.descricao);
    setMateriaId(habilidade.materia_id);
    setSerieId(habilidade.habilidades_serie_id || '');
    setMostrarFormulario(true);
    toast('Você está alterando uma habilidade!', { icon: '⚠️' });
  }

  function cancelarEdicao() {
    setHabilidadeEmEdicao(null);
    setDescricao('');
    setMateriaId('');
    setSerieId('');
    setMostrarFormulario(false);
  }

  async function salvarHabilidade(e) {
    e.preventDefault();
    
    if (!descricao || !materiaId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const habilidade = {
      descricao,
      materia_id: parseInt(materiaId),
      habilidades_serie_id: serieId ? parseInt(serieId) : 0,
      cod: habilidadeEmEdicao?.cod
    };

    const acao = habilidadeEmEdicao
      ? servicoHabilidade.atualizarHabilidade(habilidade)
      : servicoHabilidade.incluirHabilidade(habilidade);

    toast.promise(
      acao.then(() => {
        buscarTodasHabilidades();
        cancelarEdicao();
      }),
      {
        loading: habilidadeEmEdicao ? 'Atualizando...' : 'Cadastrando...',
        success: habilidadeEmEdicao ? 'Habilidade atualizada!' : 'Habilidade cadastrada!',
        error: 'Erro ao salvar',
      }
    );
  }

  async function buscarPorDescricao(termo) {
    setBusca(termo);
    if (termo.trim() === '') {
      buscarTodasHabilidades();
    } else {
      // Filtrar habilidades localmente por descrição
      if (materias.length > 0) {
        try {
          const habilidadesRes = await servicoHabilidade.consultarHabMat(materias[0].id);
          const todasHabilidades = habilidadesRes.listaDeHabilidades || [];
          const filtradas = todasHabilidades.filter(hab => 
            hab.descricao.toLowerCase().includes(termo.toLowerCase())
          );
          setHabilidades(filtradas);
        } catch (error) {
          console.error('Erro ao buscar:', error);
        }
      }
    }
  }

  function obterNomeMateria(materiaId) {
    const materia = materias.find(m => m.id === materiaId);
    return materia ? materia.nome : 'Matéria não encontrada';
  }

  return (
    <div>
      <Toaster position="top-center" />
      <Page />
      <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-6xl px-4 space-y-8">
          {!mostrarFormulario && (
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Habilidades Cadastradas</h2>
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Código</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Descrição</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Matéria</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Série ID</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800/40">
                    {habilidades.map((habilidade, index) => (
                      <tr key={index} className="hover:bg-gray-700/40 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-300">{habilidade.cod}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{habilidade.descricao}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{obterNomeMateria(habilidade.materia_id)}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {habilidade.habilidades_serie_id === 0 ? 'Todas' : habilidade.habilidades_serie_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => editarHabilidade(habilidade)} className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-400">Editar</button>
                            <button onClick={() => excluirHabilidade(habilidade)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400">Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {habilidades.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-red-400 py-4">Nenhuma habilidade encontrada.</td>
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
                {habilidadeEmEdicao ? 'Editar Habilidade' : 'Cadastro de Habilidade'}
              </h2>
              <div className="flex justify-center mb-6">
                <img
                  src={logoPrefeitura}
                  alt="Logo da Prefeitura"
                  className="h-24 w-auto"
                />
              </div>
              <form onSubmit={salvarHabilidade} className="space-y-6" noValidate>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="descricao" className="text-sm font-medium text-white mb-1">Descrição da Habilidade</label>
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
                  <div>
                    <label htmlFor="materia" className="text-sm font-medium text-white mb-1">Matéria</label>
                    <select
                      id="materia"
                      value={materiaId}
                      onChange={(e) => setMateriaId(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-red-500"
                      required
                    >
                      <option value="">Selecione uma matéria</option>
                      {materias.map((materia) => (
                        <option key={materia.id} value={materia.id}>
                          {materia.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="serie" className="text-sm font-medium text-white mb-1">Série (Opcional)</label>
                    <select
                      id="serie"
                      value={serieId}
                      onChange={(e) => setSerieId(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-red-500"
                    >
                      <option value="">Selecione uma série</option>
                      {series.map((serie) => (
                        <option key={serie.serieId} value={serie.serieId}>
                          {serie.serieNum}º Ano - {serie.serieDescr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-700 hover:bg-green-800 transition-colors text-white py-2 px-4 rounded-lg">
                  {habilidadeEmEdicao ? 'Atualizar' : 'Cadastrar'}
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