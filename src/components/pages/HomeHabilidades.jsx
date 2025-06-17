import { useState, useEffect } from 'react';
import { Trash2, Pencil, Search, Plus, AlertCircle, Loader2, BookOpen, Book } from 'lucide-react';
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

  // Group skills by subject - similar to SkillSelector
  const habilidadesPorMateria = habilidades.reduce((acc, habilidade) => {
    const materiaId = habilidade.materia_id;
    const nomeMateria = obterNomeMateria(materiaId);
    
    if (!acc[nomeMateria]) {
      acc[nomeMateria] = [];
    }
    acc[nomeMateria].push(habilidade);
    return acc;
  }, {});

  function obterCorMateria(nomeMateria) {
    const colors = {
      'Matemática': 'bg-blue-100 text-blue-700 border-blue-300',
      'Português': 'bg-red-100 text-red-700 border-red-300',
      'Ciências': 'bg-green-100 text-green-700 border-green-300',
      'História': 'bg-amber-100 text-amber-700 border-amber-300',
      'Geografia': 'bg-purple-100 text-purple-700 border-purple-300',
      'Artes': 'bg-pink-100 text-pink-700 border-pink-300',
      'Educação Física': 'bg-orange-100 text-orange-700 border-orange-300',
      'Inglês': 'bg-indigo-100 text-indigo-700 border-indigo-300'
    };
    return colors[nomeMateria] || 'bg-gray-100 text-gray-700 border-gray-300';
  }

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
      
      // Carregar habilidades de TODAS as matérias
      if (materiasRes.listaDeMaterias?.length > 0) {
        await buscarTodasHabilidadesDeTodasMaterias(materiasRes.listaDeMaterias);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Erro ao carregar dados do sistema');
      toast.error('Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  }

  async function buscarTodasHabilidadesDeTodasMaterias(listaMaterias = materias) {
    try {
      const todasHabilidades = [];
      
      // Buscar habilidades para cada matéria
      for (const materia of listaMaterias) {
        try {
          const habilidadesRes = await servicoHabilidade.consultarHabMat(materia.id);
          if (habilidadesRes.listaDeHabilidades) {
            todasHabilidades.push(...habilidadesRes.listaDeHabilidades);
          }
        } catch (error) {
          console.error(`Erro ao buscar habilidades da matéria ${materia.nome}:`, error);
          // Continue com as outras matérias mesmo se uma falhar
        }
      }
      
      setHabilidades(todasHabilidades);
    } catch (error) {
      console.error('Erro ao buscar todas as habilidades:', error);
      toast.error('Erro ao carregar algumas habilidades');
    }
  }

  async function buscarTodasHabilidades() {
    if (materias.length > 0) {
      await buscarTodasHabilidadesDeTodasMaterias();
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

    // Estrutura dos dados conforme esperado pelo backend
    const dadosHabilidade = {
      habilidades_cod: habilidadeEmEdicao ? habilidadeEmEdicao.cod : 0, // 0 para nova habilidade
      habilidades_descricao: descricao.trim(),
      habilidades_mat_id: parseInt(materiaId),
      habilidades_serie_id: serieId ? parseInt(serieId) : 0 // 0 se não selecionou série
    };

    console.log('Dados enviados para o backend:', dadosHabilidade);

    try {
      let resultado;
      
      if (habilidadeEmEdicao) {
        // Alteração - chama o método alterar do backend
        resultado = await servicoHabilidade.atualizarHabilidade(dadosHabilidade);
      } else {
        // Inclusão - chama o método gravarHab do backend
        resultado = await servicoHabilidade.incluirHabilidade(dadosHabilidade);
      }

      console.log('Resultado do backend:', resultado);

      if (resultado.status) {
        toast.success(resultado.mensagem || (habilidadeEmEdicao ? 'Habilidade atualizada!' : 'Habilidade cadastrada!'));
        await buscarTodasHabilidades();
        cancelarEdicao();
      } else {
        toast.error(resultado.mensagem || 'Erro ao salvar habilidade');
      }
    } catch (error) {
      console.error('Erro ao salvar habilidade:', error);
      toast.error('Erro ao salvar habilidade: ' + (error.message || 'Erro desconhecido'));
    }
  }

  async function buscarPorDescricao(termo) {
    setBusca(termo);
    if (termo.trim() === '') {
      buscarTodasHabilidades();
    } else {
      // Filtrar todas as habilidades de todas as matérias
      try {
        const todasHabilidades = [];
        
        // Buscar em todas as matérias
        for (const materia of materias) {
          try {
            const habilidadesRes = await servicoHabilidade.consultarHabMat(materia.id);
            if (habilidadesRes.listaDeHabilidades) {
              todasHabilidades.push(...habilidadesRes.listaDeHabilidades);
            }
          } catch (error) {
            console.error(`Erro ao buscar habilidades da matéria ${materia.nome}:`, error);
          }
        }
        
        // Filtrar por descrição
        const filtradas = todasHabilidades.filter(hab => 
          hab.descricao.toLowerCase().includes(termo.toLowerCase())
        );
        setHabilidades(filtradas);
      } catch (error) {
        console.error('Erro ao buscar:', error);
        toast.error('Erro ao realizar busca');
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
          <div className="max-w-7xl  mx-auto">
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

              {/* Grouped skills display */}
              <div className="mt-6 space-y-6">
                {Object.entries(habilidadesPorMateria).length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Nenhuma habilidade encontrada.
                  </div>
                ) : (
                  Object.entries(habilidadesPorMateria).map(([nomeMateria, habilidadesMateria]) => (
                    <div key={nomeMateria} className="bg-white shadow rounded-lg overflow-hidden">
                      {/* Subject header */}
                      <div className={`px-6 py-4 ${obterCorMateria(nomeMateria)} border-b-2`}>
                        <div className="flex items-center gap-3">
                          <Book size={20} />
                          <h3 className="text-lg font-semibold">
                            {nomeMateria} ({habilidadesMateria.length} habilidade{habilidadesMateria.length !== 1 ? 's' : ''})
                          </h3>
                        </div>
                      </div>

                      {/* Skills table for this subject */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Código
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Série
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {habilidadesMateria.map((habilidade, index) => (
                              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {habilidade.cod}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                                  <div className="truncate" title={habilidade.descricao}>
                                    {habilidade.descricao}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {habilidade.habilidades_serie_id === 0 ? "Todas" : habilidade.habilidade_serie_id + "º"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    <button 
                                      onClick={() => editarHabilidade(habilidade)} 
                                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition-colors duration-150"
                                      title="Editar habilidade"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </button>
                                    <button 
                                      onClick={() => excluirHabilidade(habilidade)} 
                                      className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors duration-150"
                                      title="Excluir habilidade"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-4xl px-4 space-y-8">
            <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">
                  {habilidadeEmEdicao ? 'Editar Habilidade' : 'Cadastro de Habilidade'}
                </h2>
                <img
                  src={logoPrefeitura}
                  alt="Logo da Prefeitura"
                  className="h-24 w-auto"
                />
              </div>
              
              <form onSubmit={salvarHabilidade} className="space-y-6" noValidate>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="descricao" className="flex items-center gap-2 text-sm font-medium text-white mb-1">
                      <BookOpen className="w-4 h-4" />
                      Descrição da Habilidade *
                    </label>
                    <input
                      type="text"
                      id="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Digite a descrição"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="materia" className="flex items-center gap-2 text-sm font-medium text-white mb-1">
                      <Book className="w-4 h-4" />
                      Matéria *
                    </label>
                    <select
                      id="materia"
                      value={materiaId}
                      onChange={(e) => setMateriaId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    <label htmlFor="serie" className="flex items-center gap-2 text-sm font-medium text-white mb-1">
                      <BookOpen className="w-4 h-4" />
                      Série
                    </label>
                    <select
                      id="serie"
                      value={serieId}
                      onChange={(e) => setSerieId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                
                <div className="space-y-3">
                  <button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    {habilidadeEmEdicao ? 'Alterar' : 'Confirmar'}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelarEdicao} 
                    className="w-full bg-gray-600 hover:bg-gray-700 transition-colors text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    Voltar
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