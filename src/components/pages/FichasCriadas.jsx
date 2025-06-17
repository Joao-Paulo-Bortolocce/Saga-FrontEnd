import React, { useState, useEffect } from 'react';
import { Trash2, Eye, AlertCircle, BookOpen } from 'lucide-react';
import { consultarFicha } from '../../service/serviceFicha';
import { apagarHabilidadeDaFicha, consultarHabilidadesDaFicha } from '../../service/serviceHabilidadesDaFicha';
import { consultarHabMat } from '../../service/serviceHabilidade';

const FichasCriadas = () => {
  const [fichas, setFichas] = useState([]);
  const [fichaSelecionada, setFichaSelecionada] = useState(null);
  const [habilidadesDaFicha, setHabilidadesDaFicha] = useState([]);
  const [detalhesHabilidades, setDetalhesHabilidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHabilidades, setLoadingHabilidades] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarFichas();
  }, []);

  const carregarFichas = async () => {
    try {
      setLoading(true);
      const response = await consultarFicha();
      if (response.status) {
        setFichas(response.listaDeFichas);
      } else {
        setError('Erro ao carregar fichas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const carregarHabilidadesDaFicha = async (ficha) => {
    try {
      setLoadingHabilidades(true);
      setFichaSelecionada(ficha);
      setHabilidadesDaFicha([]);
      setDetalhesHabilidades([]);

      const response = await consultarHabilidadesDaFicha(ficha.ficha_id);
      
      if (response.status && response.listaDeHabilidadesDaFicha) {
        setHabilidadesDaFicha(response.listaDeHabilidadesDaFicha);
        
        // Buscar detalhes das habilidades
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando fichas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button 
            onClick={carregarFichas}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visualização de Fichas
          </h1>
          <p className="text-gray-600">
            Gerencie as fichas e suas habilidades associadas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Fichas */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Fichas Cadastradas
              </h2>
            </div>
            <div className="p-6">
              {fichas.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma ficha encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fichas.map((ficha) => (
                    <div
                      key={ficha.ficha_id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        fichaSelecionada?.ficha_id === ficha.ficha_id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => carregarHabilidadesDaFicha(ficha)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Ficha #{ficha.ficha_id}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>{getSerieNome(ficha.ficha_bimestre_serie_id)}</p>
                            <p>{getBimestreNome(ficha.ficha_bimestre_id)} - {getAnoLetivoNome(ficha.ficha_bimestre_anoLetivo_id)}</p>
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {fichaSelecionada 
                  ? `Habilidades da Ficha #${fichaSelecionada.ficha_id}`
                  : 'Selecione uma ficha'
                }
              </h2>
            </div>
            <div className="p-6">
              {!fichaSelecionada ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Clique em uma ficha para ver suas habilidades
                  </p>
                </div>
              ) : loadingHabilidades ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando habilidades...</p>
                </div>
              ) : detalhesHabilidades.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Nenhuma habilidade encontrada para esta ficha
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detalhesHabilidades.map((habilidade) => (
                    <div
                      key={habilidade.habilidadesDaFicha_id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            Código: {habilidade.cod}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {habilidade.descricao}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID da Habilidade: {habilidade.habilidadesDaFicha_habilidades_id}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removerHabilidadeDaFicha(habilidade);
                          }}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Remover habilidade da ficha"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichasCriadas;