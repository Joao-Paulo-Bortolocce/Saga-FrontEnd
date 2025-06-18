import React, { useEffect, useState, useRef } from 'react';
import { Printer, GraduationCap, User, Save, FileDown, AlertTriangle, ArrowLeft } from 'lucide-react';
import { consultarMatricula } from "../../service/serviceMatricula.js"
import { consultarSerie } from "../../service/servicoSerie.js"
import { consultarFicha } from "../../service/serviceFicha.js"
import { consultarHabilidadesDaFicha } from "../../service/serviceHabilidadesDaFicha.js"
import { gravarAvaliacao, consultarTodos, buscarAvaliacoesDeMat } from "../../service/serviceAvaliacaoDaMatricula.js"
import { consultarBimestre } from "../../service/serviceBimestre.js"
import { consultarHabMat } from "../../service/serviceHabilidade.js"
import { gravarFichaDaMatricula, consultarFichaDaMatricula, alterarFichaDaMatricula } from '../../service/serviceFichaDaMatricula.js';
import AssessmentButton from "../AssessmentButton.jsx"
import ConfirmationModal from '../ConfirmationModal';

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
  const [enviandoValidacao, setEnviandoValidacao] = useState(false);
  const [estado, setEstado] = useState(1);
  const[fichaDaMatricula,setFichaDaMatricula]=useState(null);

  // Estados para controle de alterações
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalAssessments, setOriginalAssessments] = useState({});
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [assessmentsLoaded, setAssessmentsLoaded] = useState(false);

  // Ref para controlar se estamos navegando programaticamente
  const isNavigatingProgrammatically = useRef(false);

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

        // Extrair a lista de bimestres da resposta
        let listaBimestres = [];
        if (responseBimestres && responseBimestres.listaDeBimestres) {
          listaBimestres = responseBimestres.listaDeBimestres;
        } else if (Array.isArray(responseBimestres)) {
          listaBimestres = responseBimestres;
        }

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
        setAssessmentsLoaded(false);
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
        const response = await buscarAvaliacoesDeMat(parseInt(matriculaSelecionada));

        let avaliacoes = [];
        if (response && response.status && response.listaDeAvaliacoes) {
          avaliacoes = response.listaDeAvaliacoes;
        } else if (response && Array.isArray(response)) {
          avaliacoes = response;
        }

        if (avaliacoes && avaliacoes.length > 0) {
          const novasHabilidades = habilidades.map(hab => {
            const avaliacao = avaliacoes.find(av =>
              av.avaHabId === hab.habilidadesDaFicha_id
            );
            return {
              ...hab,
              assessment: avaliacao ? avaliacao.avaAv : null
            };
          });
          setHabilidades(novasHabilidades);

          // Salvar estado original das avaliações
          const originalState = {};
          novasHabilidades.forEach(hab => {
            originalState[hab.habilidadesDaFicha_id] = hab.assessment;
          });
          setOriginalAssessments(originalState);
        } else {
          // Salvar estado original vazio
          const originalState = {};
          habilidades.forEach(hab => {
            originalState[hab.habilidadesDaFicha_id] = null;
          });
          setOriginalAssessments(originalState);
        }

        // Marcar que as avaliações foram carregadas
        setAssessmentsLoaded(true);
        // Reset do estado de alterações
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      }
    }
    carregarAvaliacoes();
  }, [matriculaSelecionada, fichaAtiva, habilidades.length]);

  function buscaFichaMatricula(matriculaId) {
    consultarFichaDaMatricula(2).
      then((resultado) => {
        if (Array.isArray(resultado)) {
          const fichaExistente = resultado?.find(f =>
            (f.matricula.id === parseInt(matriculaSelecionada) ||  f.matricula.id === parseInt(matriculaId)) &&
            f.ficha.ficha_id === fichaAtiva.ficha_id
          );
          if (fichaExistente) {
            setFichaDaMatricula(fichaExistente)
            setEstado(fichaExistente.status);
          }
          else {
            setFichaDaMatricula(null)
            setEstado(1);
          }
        }
        else {
          setFichaDaMatricula(null)
          setEstado(1);
        }
      })
  }

  // Verificar se há alterações não salvas
  const checkForUnsavedChanges = () => {
    // Só verificar alterações se as avaliações foram carregadas e há habilidades
    if (!assessmentsLoaded || habilidades.length === 0) return false;

    return habilidades.some(hab => {
      const originalValue = originalAssessments[hab.habilidadesDaFicha_id];
      const currentValue = hab.assessment;
      return originalValue !== currentValue;
    });
  };

  const enviarFichaParaValidacao = async () => {
    if (!matriculaSelecionada || !fichaAtiva || habilidades.length === 0) {
      alert("Selecione uma matrícula, série e bimestre para enviar para validação");
      return;
    }

    // Verificar se há avaliações preenchidas
    const avaliacoesPreenchidas = habilidades.filter(hab => hab.assessment && hab.assessment !== "0");
    if (avaliacoesPreenchidas.length === 0) {
      alert("Preencha pelo menos uma avaliação antes de enviar para validação");
      return;
    }

    try {
      setEnviandoValidacao(true);

      // Aqui você pode implementar a lógica para enviar para validação
      // Por exemplo, chamar um serviço específico para mudar o status da ficha

      // Simulação de envio (substitua pela sua lógica real)
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert("Ficha enviada para validação com sucesso!");

      // Aqui você pode atualizar algum estado ou recarregar dados se necessário

    } catch (error) {
      console.error("Erro ao enviar ficha para validação:", error);
      alert("Erro ao enviar ficha para validação");
    } finally {
      setEnviandoValidacao(false);
    }
  };


  const handleRecordUpdated = async () => {
    console.log('Registro atualizado, recarregando dados...');
    // Recarregar dados se necessário
    try {
      const result = await consultarTodos();
      if (result && result.status && result.listaDeAvaliacoes) {
        setAssessmentRecords(result.listaDeAvaliacoes);
      }
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
    }
  };

  // Atualizar estado de alterações quando habilidades mudam
  useEffect(() => {
    const hasChanges = checkForUnsavedChanges();
    setHasUnsavedChanges(hasChanges);
  }, [habilidades, originalAssessments, assessmentsLoaded]);

  // Interceptar mudanças de seleção
  const handleChangeWithConfirmation = (changeFunction, ...args) => {
    if (hasUnsavedChanges && !isNavigatingProgrammatically.current) {
      setPendingAction(() => () => changeFunction(...args));
      setIsConfirmationModalOpen(true);
    } else {
      changeFunction(...args);
    }
  };

  const handleChangeSerie = (e) => {
    const serieId = e.target.value;
    isNavigatingProgrammatically.current = true;
    setSerieSelecionada(serieId);
    setMatriculaSelecionada("");
    setBimestreSelecionado("");
    setFichaAtiva(null);
    setHabilidades([]);
    setOriginalAssessments({});
    setHasUnsavedChanges(false);
    setAssessmentsLoaded(false);
    isNavigatingProgrammatically.current = false;
  };

  const handleChangeBimestre = (e) => {
    const bimestreId = e.target.value;
    isNavigatingProgrammatically.current = true;
    setBimestreSelecionado(bimestreId);
    setMatriculaSelecionada("");
    setFichaAtiva(null);
    setHabilidades([]);
    setOriginalAssessments({});
    setHasUnsavedChanges(false);
    setAssessmentsLoaded(false);

    if (serieSelecionada && bimestreId) {
      const fichaParaSerieBimestre = fichas.listaDeFichas?.find(f =>
        f.ficha_bimestre_serie_id === parseInt(serieSelecionada) &&
        f.ficha_bimestre_id === parseInt(bimestreId)
      );
      setFichaAtiva(fichaParaSerieBimestre || null);
    }
    isNavigatingProgrammatically.current = false;
  };

  const handleChangeMatricula = (e) => {
    const matriculaId = e.target.value;
    isNavigatingProgrammatically.current = true;
    setMatriculaSelecionada(matriculaId);
    buscaFichaMatricula(matriculaId)
    setHasUnsavedChanges(false);
    setAssessmentsLoaded(false);
    isNavigatingProgrammatically.current = false;
  };

  const handleAssessmentChange = (habilidadeId, value) => {
    setHabilidades(prevHabilidades =>
      prevHabilidades.map(hab => {
        if (hab.habilidadesDaFicha_id === habilidadeId) {
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
    if (!matriculaSelecionada || !fichaAtiva || habilidades.length === 0) {
      alert("Selecione uma matrícula, série e bimestre para salvar");
      return;
    }

    try {
      setSalvando(true);

      // Preparar arrays para o backend
      const habilidadeIds = habilidades.map(hab => hab.habilidadesDaFicha_id);
      const avaliacoes = habilidades.map(hab => hab.assessment || "0"); // Usar "0" para valores null

      const avaliacaoData = {
        avaliacaodamatricula_matricula_matricula_id: parseInt(matriculaSelecionada),
        avaliacaodamatricula_habilidadesdaficha_habilidadesdaficha_id: habilidadeIds,
        avaliacaodamatricula_av: avaliacoes
      };

      console.log('Dados da avaliação sendo enviados:', avaliacaoData);

      const resultado = await gravarAvaliacao(avaliacaoData);

      if (resultado && resultado.status) {
        console.log('Avaliação salva com sucesso, verificando FichaDaMatricula...');

        // Verificar se já existe uma FichaDaMatricula para esta matrícula e ficha
        try {
          const fichasDaMatricula = await consultarFichaDaMatricula();
          console.log('Fichas da matrícula consultadas:', fichasDaMatricula);

          // Verificar se já existe um registro para esta matrícula e ficha
          const fichaExistente = fichasDaMatricula?.find(f =>
            f.matricula_id === parseInt(matriculaSelecionada) &&
            f.ficha_id === fichaAtiva.ficha_id
          );

          if (fichaExistente) {
            console.log('FichaDaMatricula já existe:', fichaExistente);
            alert(resultado.mensagem || "Avaliação salva com sucesso!");
          } else {
            console.log('FichaDaMatricula não existe, criando nova...');

            // Criar registro na FichaDaMatricula

            const fichaDaMatriculaData = {
              ficha: { ficha_id: fichaAtiva.ficha_id },
              matricula: { id: parseInt(matriculaSelecionada) },
              observacao: null,
              status: 1
            };

            console.log('Dados da FichaDaMatricula sendo enviados:', fichaDaMatriculaData);

            const resultadoFicha = await gravarFichaDaMatricula(fichaDaMatriculaData);
            console.log('Resultado da criação da FichaDaMatricula:', resultadoFicha);

            if (resultadoFicha && (resultadoFicha.status || resultadoFicha.success)) {
              alert(resultado.mensagem || "Avaliação e ficha da matrícula salvas com sucesso!");
            } else {
              alert((resultado.mensagem || "Avaliação salva com sucesso!") + "\nAviso: " + (resultadoFicha.mensagem || "Erro ao criar ficha da matrícula"));
            }
          }
        } catch (fichaError) {
          console.error("Erro ao verificar/criar ficha da matrícula:", fichaError);
          alert((resultado.mensagem || "Avaliação salva com sucesso!") + "\nAviso: Erro ao verificar ficha da matrícula");
        }

        // Atualizar estado original após salvar
        const newOriginalState = {};
        habilidades.forEach(hab => {
          newOriginalState[hab.habilidadesDaFicha_id] = hab.assessment;
        });
        setOriginalAssessments(newOriginalState);
        setHasUnsavedChanges(false);
        buscaFichaMatricula();
        
      } else {
        alert(resultado.mensagem || "Erro ao salvar avaliações");
      }
    } catch (error) {
      console.error("Erro ao salvar avaliações:", error);
      alert("Erro ao salvar avaliações");
    } finally {
      setSalvando(false);
    }
  };

  const enviarValidacao = async () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => executeRecuperarFichas());
      setIsConfirmationModalOpen(true);
      return;
    }

    if (!matriculaSelecionada || !fichaAtiva) {
      alert("Selecione uma matrícula e série para enviar validação");
      return;
    }

    try {
      // Verificar se já existe uma FichaDaMatricula para esta matrícula e ficha
      console.log('Verificando FichaDaMatricula existente...');

      const fichasDaMatricula = await consultarFichaDaMatricula();
      console.log('Fichas da matrícula consultadas:', fichasDaMatricula);

      // Verificar se já existe um registro para esta matrícula e ficha
      const fichaExistente = fichasDaMatricula?.find(f =>
        f.matricula_id === parseInt(matriculaSelecionada) &&
        f.ficha_id === fichaAtiva.ficha_id
      );

      const fichaDaMatriculaData = {
        ficha: { ficha_id: fichaAtiva.ficha_id },
        matricula: { id: parseInt(matriculaSelecionada) },
        observacao: null,
        status: 2
      };

      if (fichaExistente) {
        console.log('FichaDaMatricula já existe, atualizando:', fichaExistente);
        // Se já existe, usar alterarFichaDaMatricula
        const resultado = await alterarFichaDaMatricula(fichaDaMatriculaData);

        if (resultado && (resultado.status || resultado.success)) {
          alert(resultado.mensagem || "Validação enviada com sucesso!");
        } else {
          alert(resultado.mensagem || "Erro ao enviar validação");
        }
      } else {
        console.log('FichaDaMatricula não existe, criando nova...');
        // Se não existe, criar novo registro
        console.log('Dados da FichaDaMatricula sendo enviados:', fichaDaMatriculaData);

        const resultado = await alterarFichaDaMatricula(fichaDaMatriculaData);
        console.log('Resultado da criação da FichaDaMatricula:', resultado);

        if (resultado && (resultado.status || resultado.success)) {
          alert(resultado.mensagem || "Validação enviada com sucesso!");
        } else {
          alert(resultado.mensagem || "Erro ao enviar validação");
        }
      }
      buscaFichaMatricula()

    } catch (error) {
      console.error("Erro ao enviar validação:", error);
      alert("Erro ao enviar validação");
    }
  };

  const executeRecuperarFichas = async () => {
    try {
      setRecuperando(true);
      const result = await consultarTodos();

      if (result && result.status && result.listaDeAvaliacoes && result.listaDeAvaliacoes.length > 0) {
        setAssessmentRecords(result.listaDeAvaliacoes);
        setIsRecoveryModalOpen(true);
      } else if (Array.isArray(result) && result.length > 0) {
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
    const matricula = matriculas.find(m => m.id === record.avaMatId);

    if (matricula) {
      isNavigatingProgrammatically.current = true;
      setSerieSelecionada(matricula.serie.serieId.toString());
      setMatriculaSelecionada(matricula.id.toString());
      setHasUnsavedChanges(false);
      setAssessmentsLoaded(false);
      isNavigatingProgrammatically.current = false;
    } else {
      alert(`Matrícula ${record.avaMatId} não encontrada`);
    }
  };

  const handleConfirmSave = async () => {
    setIsConfirmationModalOpen(false);
    await salvarAvaliacao();
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleDiscardChanges = () => {
    setIsConfirmationModalOpen(false);
    setHasUnsavedChanges(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCancelAction = () => {
    setIsConfirmationModalOpen(false);
    setPendingAction(null);
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => window.location.href = '/funcionalidades');
      setIsConfirmationModalOpen(true);
    } else {
      window.location.href = '/funcionalidades';
    }
  };

  // Interceptar tentativas de sair da página
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

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
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </button>
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Sistema de Avaliação</h1>
                <p className="text-sm text-gray-600">Avaliação de Matrícula</p>
              </div>
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  <AlertTriangle size={16} />
                  <span>Alterações não salvas</span>
                </div>
              )}
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
                onChange={(e) => handleChangeWithConfirmation(handleChangeSerie, e)}
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
                onChange={(e) => handleChangeWithConfirmation(handleChangeBimestre, e)}
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
                onChange={(e) => handleChangeWithConfirmation(handleChangeMatricula, e)}
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
                              disabled={!(fichaDaMatricula==null || fichaDaMatricula.status === 1)}
                              currentValue={habilidade.assessment}
                              onClick={() => handleAssessmentChange(habilidade.habilidadesDaFicha_id, 'NA')}
                              color="red"
                            />
                            <AssessmentButton
                              value="EC"
                              disabled={!(fichaDaMatricula==null || fichaDaMatricula.status === 1)}
                              currentValue={habilidade.assessment}
                              onClick={() => handleAssessmentChange(habilidade.habilidadesDaFicha_id, 'EC')}
                              color="yellow"
                            />
                            <AssessmentButton
                              value="A"
                              disabled={!(fichaDaMatricula==null || fichaDaMatricula.status === 1)}
                              currentValue={habilidade.assessment}
                              onClick={() => handleAssessmentChange(habilidade.habilidadesDaFicha_id, 'A')}
                              color="green"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Comentário</h3>
              <textarea
                value={fichaDaMatricula!=null && (fichaDaMatricula.observacao!=null || fichaDaMatricula.observacao!=="")? fichaDaMatricula.observacao : "Não há comentário"}
                disabled={true}
                rows={4}
                placeholder="Escreva seu comentário sobre a avaliação..."
                className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              </div>
            </div>

           {(!fichaDaMatricula || fichaDaMatricula.status === 1) && ( <div className="fixed bottom-8 right-8 print:hidden">
              <button
                onClick={salvarAvaliacao}
                disabled={salvando || loading || loadingHabilidades}
                className={`px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white ${hasUnsavedChanges
                  ? 'bg-orange-600 hover:bg-orange-700 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {salvando ? (
                  <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <Save size={20} />
                )}
                <span>{salvando ? 'Salvando...' : 'Salvar Avaliação'}</span>
              </button>
            </div>)}
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

        {(fichaDaMatricula==null || fichaDaMatricula.status==1)&&(<div className="fixed bottom-8 left-8 print:hidden">
          <button
            onClick={enviarValidacao}
            disabled={recuperando || loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {recuperando ? (
              <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
            ) : (
              <FileDown size={20} />
            )}
            <span>{recuperando ? 'Enviando...' : 'Enviar para Validação'}</span>
          </button>
        </div>)}

        <div className="hidden print:flex flex-col items-center text-gray-700 print:mt-32">
          <div className="border-t border-gray-400 w-64 mt-12"></div>
          <p className="mt-2 text-sm">Assinatura do Responsável</p>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirmSave={handleConfirmSave}
        onDiscardChanges={handleDiscardChanges}
        onCancel={handleCancelAction}
      />
    </div>
  );
}

export default AvaliaPage;