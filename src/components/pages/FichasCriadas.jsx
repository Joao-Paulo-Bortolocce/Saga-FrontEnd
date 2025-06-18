import React, { useState, useEffect } from 'react';
import { Trash2, Eye, AlertCircle, BookOpen, Search, X, ArrowLeft, Lock, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { consultarFicha } from '../../service/serviceFicha';
import { apagarHabilidadeDaFicha, consultarHabilidadesDaFicha } from '../../service/serviceHabilidadesDaFicha';
import { consultarHabMat } from '../../service/serviceHabilidade';
import { consultarFichaDaMatricula } from '../../service/serviceFichaDaMatricula';
import { useNavigate } from 'react-router-dom';

const FichasCriadas = () => {
  const [fichas, setFichas] = useState([]);
  const [fichasStatus, setFichasStatus] = useState({});
  const [fichaSelecionada, setFichaSelecionada] = useState(null);
  const [habilidadesDaFicha, setHabilidadesDaFicha] = useState([]);
  const [detalhesHabilidades, setDetalhesHabilidades] = useState([]);
  const [filteredHabilidades, setFilteredHabilidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHabilidades, setLoadingHabilidades] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    carregarFichas();
  }, []);

  useEffect(() => {
    if (detalhesHabilidades.length > 0) {
      let filtered = [...detalhesHabilidades];
      
      // Filtro por busca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(hab => 
          hab.descricao.toLowerCase().includes(query) ||
          hab.cod.toString().toLowerCase().includes(query)
        );
      }
      
      setFilteredHabilidades(filtered);
    } else {
      setFilteredHabilidades([]);
    }
  }, [detalhesHabilidades, searchQuery]);

  const carregarFichas = async () => {
    try {
      setLoading(true);
      const response = await consultarFicha();
      if (response.status) {
        const fichasData = response.listaDeFichas;
        setFichas(fichasData);
        
        // Carregar status das fichas
        await loadFichasStatus(fichasData);
      } else {
        setError('Erro ao carregar fichas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const loadFichasStatus = async (fichasData) => {
    try {
      const fichasDaMatricula = await consultarFichaDaMatricula();
      
      if (Array.isArray(fichasDaMatricula)) {
        const statusMap = {};
        
        fichasDaMatricula.forEach(fichaDaMatricula => {
          const fichaId = fichaDaMatricula.ficha?.ficha_id;
          if (fichaId) {
            if (!statusMap[fichaId] || fichaDaMatricula.status > statusMap[fichaId]) {
              statusMap[fichaId] = fichaDaMatricula.status;
            }
          }
        });
        
        setFichasStatus(statusMap);
      }
    } catch (error) {
      console.error('Erro ao carregar status das fichas:', error);
      setFichasStatus({});
    }
  };

  const getFichaStatus = (fichaId) => {
    return fichasStatus[fichaId] || 1;
  };

  const isFichaEditable = (fichaId) => {
    const status = getFichaStatus(fichaId);
    return status === 1;
  };

  const getStatusLabel = (status) => {
    
    if(status==1)
      return 'Editável';
    else
      return 'Em validação';
    // switch (status) {
    //   case 1:
    //     return 'Editável';
    //   case 2:
    //     return 'Em validação';
    //   case 3:
    //     return 'Validado';
    //   default:
    //     return 'Desconhecido';
    // }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const carregarHabilidadesDaFicha = async (ficha) => {
    try {
      setLoadingHabilidades(true);
      setFichaSelecionada(ficha);
      setHabilidadesDaFicha([]);
      setDetalhesHabilidades([]);
      setSearchQuery('');

      const response = await consultarHabilidadesDaFicha(ficha.ficha_id);
      
      if (response.status && response.listaDeHabilidadesDaFicha) {
        setHabilidadesDaFicha(response.listaDeHabilidadesDaFicha);
        
        const detalhes = await Promise.all(
          response.listaDeHabilidadesDaFicha.map(async (hab) => {
            try {
              const detResponse = await consultarHabMat(hab.habilidadesDaFicha_habilidades_id);
              if (detResponse.status && detResponse.listaDeHabilidades.length > 0) {
                return {
                  ...hab,
                  descricao: detResponse.listaDeHabilidades[0].descricao,
                  cod: detResponse.listaDeHabilidades[0].cod
                };
              }
              return {
                ...hab,
                descricao: `Habilidade ${hab.habilidadesDaFicha_habilidades_id}`,
                cod: hab.habilidadesDaFicha_habilidades_id
              };
            } catch {
              return {
                ...hab,
                descricao: `Habilidade ${hab.habilidadesDaFicha_habilidades_id}`,
                cod: hab.habilidadesDaFicha_habilidades_id
              };
            }
          })
        );
        setDetalhesHabilidades(detalhes);
      }
    } catch (err) {
      setError('Erro ao carregar habilidades da ficha');
    } finally {
      setLoadingHabilidades(false);
    }
  };

  const removerHabilidadeDaFicha = async (habilidade) => {
    const fichaId = fichaSelecionada?.ficha_id;
    const isEditable = isFichaEditable(fichaId);
    
    if (!isEditable) {
      const status = getFichaStatus(fichaId);
      const statusLabel = getStatusLabel(status);
      alert(`Esta habilidade não pode ser removida porque a ficha está com status: ${statusLabel}`);
      return;
    }

    if (!window.confirm('Tem certeza que deseja remover esta habilidade da ficha?')) {
      return;
    }

    try {
      const response = await apagarHabilidadeDaFicha(
        habilidade.habilidadesDaFicha_habilidades_id,
        habilidade.habilidadesDaFicha_ficha_id
      );

      if (response.status) {
        setDetalhesHabilidades(prev => 
          prev.filter(h => h.habilidadesDaFicha_id !== habilidade.habilidadesDaFicha_id)
        );
        setHabilidadesDaFicha(prev => 
          prev.filter(h => h.habilidadesDaFicha_id !== habilidade.habilidadesDaFicha_id)
        );
      } else {
        alert('Erro ao remover habilidade');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    }
  };

  const getBimestreNome = (bimestreId) => {
    const bimestres = {
      1: '1º Bimestre',
      2: '2º Bimestre',
      3: '3º Bimestre',
      4: '4º Bimestre'
    };
    return bimestres[bimestreId] || `Bimestre ${bimestreId}`;
  };

  const getSerieNome = (serieId) => {
    const series = {
      1: '1º Ano',
      2: '2º Ano',
      3: '3º Ano',
      4: '4º Ano',
      5: '5º Ano'
    };
    return series[serieId] || `${serieId}º Ano`;
  };

  const getAnoLetivoNome = (anoId) => {
    const anos = {
      2: '2024',
      3: '2025',
      4: '2026',
      5: '2027'
    };
    return anos[anoId] || `Ano ${anoId}`;
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-lg"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando fichas...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-lg"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button 
            onClick={carregarFichas}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tentar Novamente
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/funcionalidades')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Voltar</span>
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Visualização de Fichas
                  </h1>
                  <p className="text-gray-600">
                    Gerencie as fichas e suas habilidades associadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Fichas */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                  Fichas Cadastradas
                </h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {fichas.length} ficha{fichas.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="p-6">
              {fichas.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Nenhuma ficha encontrada</p>
                  <p className="text-gray-400 text-sm mt-1">As fichas aparecerão aqui quando criadas</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  <AnimatePresence>
                    {fichas.map((ficha, index) => {
                      const status = getFichaStatus(ficha.ficha_id);
                      const isEditable = isFichaEditable(ficha.ficha_id);
                      
                      return (
                        <motion.div
                          key={ficha.ficha_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                            fichaSelecionada?.ficha_id === ficha.ficha_id
                              ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                          }`}
                          onClick={() => carregarHabilidadesDaFicha(ficha)}
                          whileHover={{ scale: fichaSelecionada?.ficha_id === ficha.ficha_id ? 1.02 : 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-gray-900 text-lg">
                                  Ficha #{ficha.ficha_id}
                                </h3>
                                {!isEditable && (
                                  <Lock size={16} className="text-gray-500" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-700 font-medium">
                                  {getSerieNome(ficha.ficha_bimestre_serie_id)}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {getBimestreNome(ficha.ficha_bimestre_id)} • {getAnoLetivoNome(ficha.ficha_bimestre_anoLetivo_id)}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(status)}`}>
                                    {getStatusLabel(status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Eye className={`h-5 w-5 transition-colors ${
                                fichaSelecionada?.ficha_id === ficha.ficha_id 
                                  ? 'text-blue-600' 
                                  : 'text-gray-400'
                              }`} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* Habilidades da Ficha */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {fichaSelecionada 
                    ? `Habilidades da Ficha #${fichaSelecionada.ficha_id}`
                    : 'Selecione uma ficha'
                  }
                </h2>
                {fichaSelecionada && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(getFichaStatus(fichaSelecionada.ficha_id))}`}>
                      {getStatusLabel(getFichaStatus(fichaSelecionada.ficha_id))}
                    </span>
                    {!isFichaEditable(fichaSelecionada.ficha_id) && (
                      <Lock size={16} className="text-gray-500" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Barra de busca */}
              {fichaSelecionada && detalhesHabilidades.length > 0 && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar habilidades por nome ou código..."
                    className="pl-10 pr-10 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700"
                    >
                      <X size={18} className="text-gray-400" />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-6">
              {!fichaSelecionada ? (
                <div className="text-center py-12">
                  <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-2">
                    Selecione uma ficha
                  </p>
                  <p className="text-gray-400 text-sm">
                    Clique em uma ficha para ver suas habilidades
                  </p>
                </div>
              ) : loadingHabilidades ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Carregando habilidades...</p>
                </div>
              ) : filteredHabilidades.length === 0 ? (
                <div className="text-center py-12">
                  {searchQuery ? (
                    <>
                      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium mb-2">
                        Nenhuma habilidade encontrada
                      </p>
                      <p className="text-gray-400 text-sm">
                        Tente buscar por outros termos
                      </p>
                      <button
                        onClick={clearSearch}
                        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Limpar busca
                      </button>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        Nenhuma habilidade encontrada
                      </p>
                      <p className="text-gray-400 text-sm">
                        Esta ficha não possui habilidades cadastradas
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* Alerta para fichas não editáveis */}
                  {fichaSelecionada && !isFichaEditable(fichaSelecionada.ficha_id) && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="text-yellow-600" size={20} />
                        <h3 className="font-semibold text-yellow-800">Ficha não editável</h3>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        Esta ficha está com status "{getStatusLabel(getFichaStatus(fichaSelecionada.ficha_id))}" e suas habilidades não podem ser removidas.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">
                        {searchQuery ? (
                          <>Mostrando {filteredHabilidades.length} de {detalhesHabilidades.length} habilidades</>
                        ) : (
                          <>{filteredHabilidades.length} habilidade{filteredHabilidades.length !== 1 ? 's' : ''} encontrada{filteredHabilidades.length !== 1 ? 's' : ''}</>
                        )}
                      </span>
                    </div>
                    
                    <AnimatePresence>
                      {filteredHabilidades.map((habilidade, index) => {
                        const isEditable = isFichaEditable(fichaSelecionada.ficha_id);
                        
                        return (
                          <motion.div
                            key={habilidade.habilidadesDaFicha_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                              isEditable 
                                ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' 
                                : 'border-gray-200 bg-gray-50/50'
                            }`}
                            whileHover={isEditable ? { scale: 1.01 } : {}}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-bold text-gray-900">
                                    Código: {habilidade.cod}
                                  </h4>
                                  {!isEditable && (
                                    <Lock size={14} className="text-gray-500" />
                                  )}
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-2">
                                  {habilidade.descricao}
                                </p>
                                <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                                  ID: {habilidade.habilidadesDaFicha_habilidades_id}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removerHabilidadeDaFicha(habilidade);
                                }}
                                disabled={!isEditable}
                                className={`ml-4 p-2 rounded-lg transition-all duration-200 ${
                                  isEditable
                                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700 hover:scale-110'
                                    : 'text-gray-400 cursor-not-allowed opacity-50'
                                }`}
                                title={isEditable ? "Remover habilidade da ficha" : `Não é possível remover - Status: ${getStatusLabel(getFichaStatus(fichaSelecionada.ficha_id))}`}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FichasCriadas;