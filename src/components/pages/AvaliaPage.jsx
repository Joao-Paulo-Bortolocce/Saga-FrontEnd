import React, { useEffect, useState } from 'react';
import { Printer, GraduationCap, User, Save, FileDown } from 'lucide-react';
import { consultarMatricula } from "../../service/serviceMatricula.js"
import { consultarSerie } from "../../service/servicoSerie.js"
import { consultarFicha } from "../../service/serviceFicha.js"
import { consultarHabilidadesDaFicha } from "../../service/serviceHabilidadesDaFicha.js"
import { gravarAvaliacao, consultarTodos, buscarAvaliacoesDeMat } from "../../service/serviceAvaliacaoDaMatricula.js"
import { consultarBimestre } from "../../service/serviceBimestre.js"
import { consultarHabMat } from "../../service/serviceHabilidade.js"
import AssessmentButton from "../AssessmentButton.jsx"
import RecoveryModal from '../RecoveryModal';

function AvaliaPage() {
  const [series, setSeries] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [bimestres, setBimestres] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [serieSelecionada, setSerieSelecionada] = useState('');
  const [bimestreSelecionado, setBimestreSelecionado] = useState('');
  const [matriculaSelecionada, setMatriculaSelecionada] = useState('');
  const [fichaAtiva, setFichaAtiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingHabilidades, setLoadingHabilidades] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [recuperando, setRecuperando] = useState(false);
  const [assessmentRecords, setAssessmentRecords] = useState([]);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        setLoading(true);
        const [listaSeries, listaMatriculas, listaFichas, avaliacoes, responseBimestres] = await Promise.all([
          consultarSerie(),
          consultarMatricula(),
          consultarFicha(),
          consultarTodos(),
          consultarBimestre()
        ]);
        
        console.log('Resposta completa dos bimestres:', responseBimestres);
        
        // Extrair a lista de bimestres da resposta
        let listaBimestres = [];
        if (responseBimestres && responseBimestres.listaDeBimestres) {
          listaBimestres = responseBimestres.listaDeBimestres;
        } else if (Array.isArray(responseBimestres)) {
          listaBimestres = responseBimestres;
        }
        
        console.log('Lista de bimestres processada:', listaBimestres);
        
        setSeries(listaSeries || []);
        setMatriculas(listaMatriculas || []);
        setFichas(listaFichas || []);
        setBimestres(listaBimestres || []);
        setAssessmentRecords(avaliacoes || []);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setLoading(false);
      }
    }
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    async function carregarHabilidades() {
      if (!fichaAtiva) return;
      
      try {
        setLoadingHabilidades(true);
        const response = await consultarHabilidadesDaFicha(fichaAtiva.ficha_id);
        
        let habilidadesDaFicha = [];
        if (response && response.status && response.listaDeHabilidadesDaFicha) {
          habilidadesDaFicha = response.listaDeHabilidadesDaFicha;
        } else if (response && Array.isArray(response)) {
          habilidadesDaFicha = response;
        }

        if (habilidadesDaFicha.length > 0) {
          // Buscar detalhes das habilidades usando consultarHabMat
          const habilidadesComDetalhes = await Promise.all(
            habilidadesDaFicha.map(async (hab) => {
              try {
                const detResponse = await consultarHabMat(hab.habilidadesDaFicha_habilidades_id);
                if (detResponse && detResponse.status && detResponse.listaDeHabilidades && detResponse.listaDeHabilidades.length > 0) {
                  return {
                    ...hab,
                    assessment: null,
                    descricao: detResponse.listaDeHabilidades[0].descricao,
                    cod: detResponse.listaDeHabilidades[0].cod
                  };
                }
                return {
                  ...hab,
                  assessment: null,
                  descricao: `Habilidade ${hab.habilidadesDaFicha_habilidades_id}`,
                  cod: hab.habilidadesDaFicha_habilidades_id
                };
              } catch (error) {
                console.error(`Erro ao buscar detalhes da habilidade ${hab.habilidadesDaFicha_habilidades_id}:`, error);
                return {
                  ...hab,
                  assessment: null,
                  descricao: `Habilidade ${hab.habilidadesDaFicha_habilidades_id}`,
                  cod: hab.habilidadesDaFicha_habilidades_id
                };
              }
            })
          );
          setHabilidades(habilidadesComDetalhes);
        } else {
          setHabilidades([]);
        }
        setLoadingHabilidades(false);
      } catch (error) {
        console.error("Erro ao carregar habilidades:", error);
        setHabilidades([]);
        setLoadingHabilidades(false);
      }
    }
    carregarHabilidades();
  }, [fichaAtiva]);

  useEffect(() => {
    async function carregarAvaliacoes() {
      if (!matriculaSelecionada || !fichaAtiva || habilidades.length === 0) return;

      try {
        const avaliacoes = await buscarAvaliacoesDeMat(parseInt(matriculaSelecionada));
        
        if (avaliacoes && Array.isArray(avaliacoes)) {
          const novasHabilidades = habilidades.map(hab => {
            const avaliacao = avaliacoes.find(av => 
              av.avaliacaodamatricula_habilidade_id === hab.habilidadesDaFicha_habilidades_id
            );
            return {
              ...hab,
              assessment: avaliacao ? avaliacao.avaliacaodamatricula_valor : null
            };
          });
          setHabilidades(novasHabilidades);
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      }
    }
    carregarAvaliacoes();
  }, [matriculaSelecionada, fichaAtiva, habilidades.length]);

  const handleChangeSerie = (e) => {
    const serieId = e.target.value;
    setSerieSelecionada(serieId);
    setMatriculaSelecionada("");
    setBimestreSelecionado("");
    setFichaAtiva(null);
    setHabilidades([]);
  };

  const handleChangeBimestre = (e) => {
    const bimestreId = e.target.value;
    setBimestreSelecionado(bimestreId);
    setMatriculaSelecionada("");
    setFichaAtiva(null);
    setHabilidades([]);
    
    if (serieSelecionada && bimestreId) {
      const fichaParaSerieBimestre = fichas.listaDeFichas.find(f => 
        f.ficha_bimestre_serie_id === parseInt(serieSelecionada) && 
        f.ficha_bimestre_id === parseInt(bimestreId)
      );
      setFichaAtiva(fichaParaSerieBimestre || null);
    }
  };

  const handleChangeMatricula = (e) => {
    setMatriculaSelecionada(e.target.value);
  };

  const handleAssessmentChange = (habilidadeId, value) => {
    setHabilidades(prevHabilidades => 
      prevHabilidades.map(hab => {
        if (hab.habilidadesDaFicha_habilidades_id === habilidadeId) {
          return {
            ...hab,
            assessment: hab.assessment === value ? null : value
          };
        }
        return hab;
      })
    );
  };

  const salvarAvaliacao = async () => {
    if (!matriculaSelecionada || !fichaAtiva) {
      alert("Selecione uma matrícula, série e bimestre para salvar");
      return;
    }

    try {
      setSalvando(true);
      let sucessos = 0;
      let erros = 0;

      for (const habilidade of habilidades) {
        if (habilidade.assessment) {
          const avaliacaoData = {
            avaliacaodamatricula_matricula_id: parseInt(matriculaSelecionada),
            avaliacaodamatricula_habilidade_id: habilidade.habilidadesDaFicha_habilidades_id,
            avaliacaodamatricula_valor: habilidade.assessment
          };

          try {
            const resultado = await gravarAvaliacao(avaliacaoData);
            if (resultado) {
              sucessos++;
            } else {
              erros++;
            }
          } catch (error) {
            console.error("Erro ao salvar avaliação:", error);
            erros++;
          }
        }
      }

      if (sucessos === 0 && erros === 0) {
        alert("Nenhuma avaliação para salvar");
      } else if (erros === 0) {
        alert(`${sucessos} avaliação(ões) salva(s) com sucesso`);
      } else if (sucessos === 0) {
        alert(`Erro ao salvar ${erros} avaliação(ões)`);
      } else {
        alert(`${sucessos} avaliação(ões) salva(s) com sucesso e ${erros} erro(s)`);
      }
    } catch (error) {
      console.error("Erro ao salvar avaliações:", error);
      alert("Erro ao salvar avaliações");
    } finally {
      setSalvando(false);
    }
  };

  const recuperarFichas = async () => {
    try {
      setRecuperando(true);
      const result = await consultarTodos();
      
      if (Array.isArray(result) && result.length > 0) {
        setAssessmentRecords(result);
        setIsRecoveryModalOpen(true);
      } else {
        alert("Nenhuma avaliação encontrada");
      }
    } catch (error) {
      console.error("Erro ao recuperar avaliações:", error);
      alert("Erro ao recuperar avaliações");
    } finally {
      setRecuperando(false);
    }
  };

  const handleSelectRecord = (record) => {
    setIsRecoveryModalOpen(false);
    const matricula = matriculas.find(m => m.id === record.avaliacaodamatricula_matricula_id);
    
    if (matricula) {
      setSerieSelecionada(matricula.serie.serieId.toString());
      setMatriculaSelecionada(matricula.id.toString());
    } else {
      alert(`Matrícula ${record.avaliacaodamatricula_matricula_id} não encontrada`);
    }
  };

  const matriculasFiltradas = serieSelecionada
    ? matriculas.filter(m => m.serie.serieId === parseInt(serieSelecionada))
    : matriculas;

  const matriculaAtual = matriculas.find(m => m.id === parseInt(matriculaSelecionada));
  const serieAtual = series.find(s => s.serieId === parseInt(serieSelecionada));
  const bimestreAtual = bimestres.find(b => b.bimestre_id === parseInt(bimestreSelecionado));

  const getBimestreNome = (bimestreId) => {
    const bimestre = bimestres.find(b => b.bimestre_id === bimestreId);
    if (bimestre) {
      return bimestre.nome || `${bimestreId}º Bimestre`;
    }
    return `${bimestreId}º Bimestre`;
  };

  const getSerieNome = (serieId) => {
    const serie = series.find(s => s.serieId === serieId);
    return serie ? serie.serieDescr : `Série ${serieId}`;
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Sistema de Avaliação</h1>
                <p className="text-sm text-gray-600">Avaliação de Matrícula</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { window.print() }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Printer size={20} />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Série:</label>
              <select
                value={serieSelecionada}
                onChange={handleChangeSerie}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="">Selecione uma série</option>
                {series.map(serie => (
                  <option key={serie.serieId} value={serie.serieId}>
                    {serie.serieDescr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bimestre:</label>
              <select
                value={bimestreSelecionado}
                onChange={handleChangeBimestre}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading || !serieSelecionada}
              >
                <option value="">Selecione um bimestre</option>
                {bimestres.map(bimestre => (
                  <option key={bimestre.bimestre_id} value={bimestre.bimestre_id}>
                    {bimestre.nome || `${bimestre.bimestre_id}º Bimestre`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aluno:</label>
              <select
                value={matriculaSelecionada}
                onChange={handleChangeMatricula}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading || !serieSelecionada || !bimestreSelecionado}
              >
                <option value="">Selecione um aluno</option>
                {matriculasFiltradas.map(matricula => (
                  <option key={matricula.id} value={matricula.id}>
                    {matricula.aluno.pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {(loading || loadingHabilidades) && (
          <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 w-32 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
              {loadingHabilidades && (
                <p className="text-sm text-gray-500 mt-2">Carregando detalhes das habilidades...</p>
              )}
            </div>
          </div>
        )}

        {!loading && !loadingHabilidades && matriculaAtual && serieAtual && bimestreAtual && fichaAtiva && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold flex justify-center text-gray-800 mb-4">Legenda da Avaliação</h3>
              <div className="flex flex-wrap justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-green-100 border-2 border-green-500 rounded-lg text-green-700 font-medium">
                    A
                  </div>
                  <span className="text-sm text-gray-600">Atingido</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 border-2 border-yellow-500 rounded-lg text-yellow-700 font-medium">
                    EC
                  </div>
                  <span className="text-sm text-gray-600">Em construção</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 border-2 border-red-500 rounded-lg text-red-700 font-medium">
                    NA
                  </div>
                  <span className="text-sm text-gray-600">Não atingido</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold flex justify-center text-gray-800 mb-4">Informações da Avaliação</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{matriculaAtual.aluno.pessoa.nome}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{serieAtual.serieDescr}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{bimestreAtual.nome || `${bimestreAtual.bimestre_id}º Bimestre`}</span>
                </div>
              </div>
              {fichaAtiva && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Ficha #{fichaAtiva.ficha_id}</strong> - {getSerieNome(fichaAtiva.ficha_bimestre_serie_id)} - {getBimestreNome(fichaAtiva.ficha_bimestre_id)} - {getAnoLetivoNome(fichaAtiva.ficha_bimestre_anoLetivo_id)}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-blue-900">Habilidades da Ficha</h3>
                  <p className="text-xs font-medium text-blue-600">AVALIAÇÃO DAS HABILIDADES</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4 grid grid-cols-7 gap-4">
                  <div className="col-span-4">
                    <h4 className="text-sm font-medium text-gray-500">HABILIDADES</h4>
                  </div>
                  <div className="col-span-3">
                    <div className="flex justify-around">
                      <span className="text-sm font-medium text-gray-500">NA</span>
                      <span className="text-sm font-medium text-gray-500">EC</span>
                      <span className="text-sm font-medium text-gray-500">A</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {habilidades.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhuma habilidade encontrada para esta ficha</p>
                    </div>
                  ) : (
                    habilidades.map((habilidade, index) => (
                      <div key={habilidade.habilidadesDaFicha_id} className="py-4 grid grid-cols-7 gap-4 items-start border-b border-gray-100">
                        <div className="col-span-4">
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-900">
                              Código: {habilidade.cod}
                            </p>
                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                              {habilidade.descricao}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>ID da Habilidade: {habilidade.habilidadesDaFicha_habilidades_id}</p>
                            <p>ID da Ficha: {habilidade.habilidadesDaFicha_id}</p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <div className="flex justify-around gap-2">
                            <AssessmentButton
                              value="NA"
                              currentValue={habilidade.assessment}
                              onClick={() => handleAssessmentChange(habilidade.habilidadesDaFicha_habilidades_id, 'NA')}
                              color="red"
                            />
                            <AssessmentButton
                              value="EC"
                              currentValue={habilidade.assessment}
                              onClick={() => handleAssessmentChange(habilidade.habilidadesDaFicha_habilidades_id, 'EC')}
                              color="yellow"
                            />
                            <AssessmentButton
                              value="A"
                              currentValue={habilidade.assessment}
                              onClick={() => handleAssessmentChange(habilidade.habilidadesDaFicha_habilidades_id, 'A')}
                              color="green"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="fixed bottom-8 right-8 print:hidden">
              <button
                onClick={salvarAvaliacao}
                disabled={salvando || loading || loadingHabilidades}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvando ? (
                  <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <Save size={20} />
                )}
                <span>{salvando ? 'Salvando...' : 'Salvar Avaliação'}</span>
              </button>
            </div>
          </div>
        )}

        {!loading && !loadingHabilidades && (!matriculaSelecionada || !serieSelecionada || !bimestreSelecionado) && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-sm text-center">
            <p className="text-blue-800">
              Selecione uma série, bimestre e um aluno para visualizar e preencher a avaliação.
            </p>
          </div>
        )}

        {!loading && !loadingHabilidades && serieSelecionada && bimestreSelecionado && !fichaAtiva && (
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 shadow-sm text-center">
            <p className="text-yellow-800">
              Nenhuma ficha encontrada para a série e bimestre selecionados.
            </p>
          </div>
        )}

        <div className="fixed bottom-8 left-8 print:hidden">
          <button
            onClick={recuperarFichas}
            disabled={recuperando || loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {recuperando ? (
              <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
            ) : (
              <FileDown size={20} />
            )}
            <span>{recuperando ? 'Recuperando...' : 'Recuperar Avaliação'}</span>
          </button>
        </div>

        <div className="hidden print:flex flex-col items-center text-gray-700 print:mt-32">
          <div className="border-t border-gray-400 w-64 mt-12"></div>
          <p className="mt-2 text-sm">Assinatura do Responsável</p>
        </div>
      </main>

      <RecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        assessmentRecords={assessmentRecords}
        onSelectRecord={handleSelectRecord}
        series={series}
        matriculas={matriculas}
      />
    </div>
  );
}

export default AvaliaPage;