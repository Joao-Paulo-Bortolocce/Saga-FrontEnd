import { useState, useEffect } from 'react';
import { Trash2, Pencil, Search, Plus, AlertCircle, Loader2, BookOpen } from 'lucide-react';
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
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro('');
      
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
      setErro('Erro ao carregar dados do sistema');
      toast.error('Erro ao carregar dados');
    } finally {
      setCarregando(false);
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
    if (window.confirm(`Deseja realmente excluir a habilidade "${habilidade.descricao}"?`)) {
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

  if (carregando) {
    return (
      <div>
        <Page />
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
            Carregando dados do sistema...
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div>
        <Page />
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
          <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <AlertCircle className="w-5 h-5 mr-2" />
            {erro}
          </div>
          <button
            onClick={() => carregarDados()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" />
      <Page />
      
      {!mostrarFormulario ? (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cadastro de Habilidades</h1>
                <p className="mt-2 text-sm text-gray-700">Lista de todas as habilidades cadastradas no sistema</p>
              </div>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <BookOpen className="h-4 w-4 mr-2" /> Nova Habilidade
              </button>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar habilidades por descrição..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  value={busca}
                  onChange={(e) => buscarPorDescricao(e.target.value)}
                />
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matéria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Série</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {habilidades.map((habilidade, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{habilidade.cod}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{habilidade.descricao}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{obterNomeMateria(habilidade.materia_id)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {habilidade.habilidades_serie_id === 0 ? 'Todas' : habilidade.habilidades_serie_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => editarHabilidade(habilidade)} 
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => excluirHabilidade(habilidade)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {habilidades.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          Nenhuma habilidade encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="text-center mb-6">
                <img
                  src={logoPrefeitura}
                  alt="Logo da Prefeitura"
                  className="h-24 w-auto mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  {habilidadeEmEdicao ? 'Editar Habilidade' : 'Cadastro de Habilidade'}
                </h2>
              </div>
              
              <form onSubmit={salvarHabilidade} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da Habilidade *
                  </label>
                  <input
                    type="text"
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Digite a descrição"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="materia" className="block text-sm font-medium text-gray-700 mb-1">
                    Matéria *
                  </label>
                  <select
                    id="materia"
                    value={materiaId}
                    onChange={(e) => setMateriaId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  <label htmlFor="serie" className="block text-sm font-medium text-gray-700 mb-1">
                    Série (Opcional)
                  </label>
                  <select
                    id="serie"
                    value={serieId}
                    onChange={(e) => setSerieId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione uma série</option>
                    {series.map((serie) => (
                      <option key={serie.serieId} value={serie.serieId}>
                        {serie.serieNum}º Ano - {serie.serieDescr}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="submit" 
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    {habilidadeEmEdicao ? 'Atualizar' : 'Cadastrar'}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelarEdicao} 
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}