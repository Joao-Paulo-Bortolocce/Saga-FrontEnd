import { useState, useEffect } from 'react';
import { incluirFrequencia, buscarFrequenciasAluno } from "../../../redux/frequenciaReducer.js";
import { buscarMatriculasFiltros } from "../../../redux/matriculaReducer.js"
import { incluirNotificacao } from '../../../redux/notificacaoReducer.js';
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ESTADO from '../../../redux/estados.js';

export default function CadastroFrequencia(props) {
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({});
  const [dataChamada, setDataChamada] = useState("");
  const {status, mensagem} = useSelector((state)=> state.frequencia);
  const {matStatus, listaDeMatriculas} = useSelector((state)=> state.matricula);
  const dispatch = useDispatch();

  useEffect(() => {
    const termos={
      serie: props.turma.serie.serieId,
      anoLetivo: props.turma.anoLetivo.id,
      valido: 1
    }
    dispatch(buscarMatriculasFiltros(termos));
  }, [props.turma, dispatch]);
  
  useEffect(() => {
    if (matStatus === ESTADO.SUCESSO && listaDeMatriculas.length > 0) {
      buscarAlunos(props.turma, listaDeMatriculas);
    }
  }, [matStatus, listaDeMatriculas, props.turma]);

  async function buscarAlunos(turma, listaDeMatriculas) {
    const listaFiltrada = listaDeMatriculas
      .filter(matricula => matricula.turma && matricula.turma.letra?.toLowerCase() === turma.letra?.toLowerCase())
      .sort((a, b) => a.aluno.pessoa.nome.toLowerCase() - b.aluno.pessoa.nome.toLowerCase());
    setAlunos(listaFiltrada ?? []);
  }

  function marcarPresenca(ra, presente) {
    setPresencas(prev => ({ ...prev, [ra]: presente }));
  }

  function voltar() {
    props.setExibirTabela(true);
  }

  async function verificarFrequencia(aluno, dados) {
    const resultado = await dispatch(buscarFrequenciasAluno(dados));
    if (!resultado.payload || !resultado.payload.listaFrequencia) {
      toast.error('Erro ao buscar frequências');
      return;
    }
    const frequencias = resultado.payload.listaFrequencia;
    const faltas = frequencias.filter(f => !f.presente).sort((a, b) => new Date(a.data) - new Date(b.data));
    
    let consecutivas = 1;
    let maxConsecutivas = 1;

    for (let i = 1; i < faltas.length; i++) {
      const anterior = new Date(faltas[i - 1].data);
      const atual = new Date(faltas[i].data);
      const diff = Math.floor((atual - anterior) / (1000 * 60 * 60 * 24));

      if (diff === 1) {
        consecutivas++;
        maxConsecutivas = Math.max(maxConsecutivas, consecutivas);
      } else {
        consecutivas = 1;
      }
    }

    let text;
    if (maxConsecutivas >= 3) {
      text = `Aluno(a) ${aluno.aluno.pessoa.nome} (RA ${aluno.aluno.ra}) apresenta ${maxConsecutivas} faltas consecutivas.`;
    } 
    if (faltas.length === 7) {
      text = `Aluno(a) ${aluno.aluno.pessoa.nome} (RA ${aluno.aluno.ra}) já acumulou 7 faltas.`;
    }

    if (text) {
      const notificacao = {
        mensagem: text,
        data: dados.data
      };
      dispatch(incluirNotificacao(notificacao));
    }
  }
  
  async function confirmarPresenca() {
    if (!dataChamada) return toast.error("Por favor, selecione a data da chamada.");
    if (alunos.length === 0) return toast.error("Nenhum aluno disponível para registrar presença.");

    for (const aluno of alunos) {
      const id = aluno.id;
      const presente = !presencas[aluno.aluno.ra];
      const dados = {
        id: id,
        presente: presente,
        data: dataChamada
      };

      try {
        await dispatch(incluirFrequencia(dados));
        if (status == ESTADO.ERRO) {
          toast.error(`Erro ao gravar frequência para RA ${aluno.aluno.ra}:`, mensagem);
        } else if(!presente) {
          await verificarFrequencia(aluno, dados);
        }
      } catch (error) {
        toast.error(`Erro de conexão para RA ${aluno.aluno.ra}:`, error);
      }
    }
    toast.success(`Presença registrada com sucesso para a turma ${props.turma.serie.serieDescr} - ${props.turma.letra} na data ${dataChamada}`);
    setTimeout(() => {
      voltar();
    }, 2000);
  }

  if (status === ESTADO.PENDENTE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          {mensagem}
        </div>
      </div>
    );
  }
  if (status === ESTADO.ERRO) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <AlertCircle className="w-5 h-5 mr-2" />
          {mensagem}
        </div>
        <button
          onClick={() => props.setExibirTabela(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-4xl px-4">
          <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Chamada - {props.turma.serie.serieDescr} - {props.turma.letra}
            </h2>

            <div className="mb-4">
              <label htmlFor="data" className="text-white">Escolha a data:</label>
              <input
                type="date"
                id="data"
                value={dataChamada}
                onChange={(e) => setDataChamada(e.target.value)}
                className="block mt-1 p-2 border border-gray-700 rounded bg-white text-black w-full"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-white divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">RA</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Nome</th>
                    <th className="px-6 py-3 text-center text-sm font-medium">Falta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {alunos.length > 0 ? (
                    alunos.map((aluno) => (
                      <tr key={aluno.id}>
                        <td className="px-6 py-4">{aluno.aluno.ra}</td>
                        <td className="px-6 py-4">{aluno.aluno.pessoa.nome}</td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={presencas[aluno.aluno.ra] || false}
                            onChange={(e) => marcarPresenca(aluno.aluno.ra, e.target.checked)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-red-500">
                        Nenhum aluno encontrado!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-end">
              <button
                onClick={confirmarPresenca}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
              <button
                onClick={voltar}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}