import React, { useEffect, useState } from 'react';
import logoPrefeitura from "../../../assets/images/logoPrefeitura.png";
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados.js';
import { incluirMatricula, atualizarMatricula } from '../../../redux/matriculaReducer.js';
import { listaDeanosLetivos } from '../../../mockDados/mockAnoLetivo.js';
import { listaDeSeries } from '../../../mockDados/mockSeries.js';
import toast, { Toaster } from "react-hot-toast";
import { buscarAlunosSemMatricula } from '../../../redux/alunoReducer.js';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formatarCPF } from "../../../service/formatadores.js"
import {buscarAnosLetivos} from "../../../service/anoLetivoService.js";
import {buscarSeries} from "../../../service/servicoSerie.js";

function CadastroMatricula(props) {
  const [matricula, setMatricula] = useState(props.matricula);
  const { estado, mensagem, listaDeAlunos } = useSelector(state => state.aluno);
  const dispachante = useDispatch();
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [listaDeanosLetivos,setListaDeanosLetivos]=useState([])
  const [listaDeSeries,setListaDeSeries]=useState([])
  const [lenCpf, setLenCpf] = useState(0);
  const [validos, setValidos] = useState([true, true, true, true, true, true]);
  const[ano, setAno]= useState(0)

  useEffect(()=>{
    buscarAnosLetivos().then((resultado)=>{
      if(resultado.status)
        setListaDeanosLetivos(resultado.anoletivo);
      else
        toast.error("Não foi possível recuparar os anos do backend")
    })
    buscarSeries().then((resultado)=>{
      if(resultado.status)
        setListaDeSeries(resultado.series);
      else
        toast.error("Não foi possível recuparar as series")
    })
  },[])

  useEffect(() => {
    dispachante(buscarAlunosSemMatricula(ano));
  }, [ano,dispachante]);


  function manipularMudanca(event) {
    const id = event.currentTarget.id;
    let valor = event.currentTarget.value;
    setValidos((prevValidos) => {
      const novosValidos = [...prevValidos];

      if (id === "anoLetivo_id"){
        setAno(valor);
        novosValidos[0] = true;
      }
      else if (id === "serie_id")
        novosValidos[1] = true;
      else if (id === 'cpf') {
        const result = formatarCPF(valor, valor.length > lenCpf);
        document.getElementById("cpf").value = result;
        setLenCpf(result.length);
        novosValidos[2] = true;
      } else if (id == "nome")
        novosValidos[3] = true;
      else if (id == "ra")
        novosValidos[4] = true;
      else {
        let atual = new Date();
        let dataInformada = new Date(valor);

        if (dataInformada > atual) {
          toast.error("A data informada é inválida", { duration: 3000, repeat: false });
          valor = "";
        }
        novosValidos[5] = true;
      }

      if (id !== "nome")
        setMatricula({ ...matricula, [id]: valor });
      return novosValidos;
    })
    filtrar();
  }

  function filtrar() {
    const cpf = document.getElementById("cpf").value.toLowerCase();
    const nome = document.getElementById("nome").value.toLowerCase();
    const ra = document.getElementById("ra").value;

    const novaListaFiltrada = listaDeAlunos.filter((aluno) => {
      const nomeAluno = aluno.pessoa.nome.toLowerCase();
      const cpfAluno = aluno.pessoa.cpf.toLowerCase();
      const raAluno = aluno.ra.toString();

      const filtroRA = ra === "0" || raAluno.includes(ra);
      const filtroNome = nome === "" || nomeAluno.includes(nome);
      const filtroCPF = cpf === "" || cpfAluno.includes(cpf);

      return filtroRA && filtroNome && filtroCPF;
    });
    setListaFiltrada(novaListaFiltrada);
  }

  function setAlunos() {
    setListaFiltrada(listaDeAlunos);
  }

  function setarValores(aluno) {
    setValidos((prevValidos) => {
      const novosValidos = [...prevValidos];
      novosValidos[2]=true;
      novosValidos[3]=true;
      novosValidos[4]=true;
      return novosValidos;
    })
    document.getElementById("cpf").value = aluno.pessoa.cpf;
    document.getElementById("nome").value = aluno.pessoa.nome;
    setMatricula({ ...matricula, ra: aluno.ra });
    filtrar();
  }

  function zeraMatricula() {
    props.setMatricula({
      ra: 0,
      anoLetivo_id: 0,
      serie_id: 0,
      data: new Date().toISOString().substring(0, 10)
    });
  }

  function validaInfos() {
    let valido = true;
    let novosValidos = [true, true, true, true, true, true];
    const cpf=document.getElementById("cpf").value;
    const nome=document.getElementById("nome").value;

    if (matricula.anoLetivo_id === "" || matricula.anoLetivo_id === 0) {
      novosValidos[0] = false;
      valido = false;
    }

    if (matricula.serie_id === "" || matricula.serie_id === 0) {
      novosValidos[1] = false;
      valido = false;
    }

    if (cpf === "" || cpf === undefined) {
      novosValidos[2] = false;
      valido = false;
    }

    if (nome === "" || nome === undefined) {
      novosValidos[3] = false;
      valido = false;
    }

    if (matricula.ra === "" || matricula.ra === 0 || matricula.ra === undefined) {
      novosValidos[4] = false;
      valido = false;
    }

    if (matricula.data === "" || matricula.data === 0) {
      novosValidos[5] = false;
      valido = false;
    }

    setValidos(novosValidos);
    return valido;
  }

  function handleSubmit(evento) {
    evento.preventDefault();

    if (validaInfos()) {
      if (props.modoEdicao) {
        dispachante(atualizarMatricula(matricula));
        props.setExibirTabela(true);
        props.setModoEdicao(false);
        zeraMatricula();
      } else {
        if (listaFiltrada.length === 1) {
          dispachante(incluirMatricula(matricula));
          props.setExibirTabela(true);
          zeraMatricula();
        } else {
          toast.error("As informações não correspondem a um aluno, preencha todos os campos corretamente", { duration: 5000, repeat: false });
        }
      }
    }
  }

  function nomeAno(id) {
      const ano = listaDeanosLetivos.filter((aux) => {
        return aux.id == id;
      })
  
      return ano[0].inicio.substring(0, 4);
    }

  if (estado === ESTADO.PENDENTE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">{mensagem}</div>
      </div>
    );
  }

  if (estado === ESTADO.ERRO) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <AlertCircle className="w-5 h-5 mr-2" />
          {mensagem}
        </div>
        <button
          onClick={() => dispachante(buscarAlunosSemMatricula())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4" onLoad={setAlunos}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden">
        <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 h-full flex flex-col">
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-wide">Registro de Matricula</h2>
            <img src={logoPrefeitura} alt="Logo da Prefeitura" className="h-16 sm:h-20 md:h-24 w-auto" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              <div className="flex flex-col lg:col-span-2">
                <label htmlFor="anoLetivo_id" className={`text-sm ${validos[0] ? 'text-white' : 'text-red-500'}`}>Ano letivo</label>
                <select
                  id="anoLetivo_id"
                  name="anoLetivo_id"
                  value={matricula.anoLetivo_id}
                  onChange={manipularMudanca}
                  className={`rounded-md p-2 bg-gray-800 text-white ${!validos[0] ? 'border border-red-500' : ''}`}
                >
                  <option value="0">Selecione</option>
                  {listaDeanosLetivos.map((ano) => (
                    <option key={ano.id} value={ano.id}>
                      {ano.inicio.substring(0, 4)}
                    </option>
                  ))}
                </select>
                {!validos[0] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
              </div>

              <div className="flex flex-col lg:col-span-1">
                <label htmlFor="serie_id" className={`text-sm ${validos[1] ? 'text-white' : 'text-red-500'}`}>Série</label>
                <select
                  id="serie_id"
                  name="serie_id"
                  value={matricula.serie_id}
                  onChange={manipularMudanca}
                  className={`rounded-md p-2 bg-gray-800 text-white ${!validos[1] ? 'border border-red-500' : ''}`}
                >
                  <option value="0">Selecione</option>
                  {listaDeSeries.map((serie) => (
                    <option key={serie.serieId} value={serie.serieId}>
                      {serie.serieDescr}
                    </option>
                  ))}
                </select>
                {!validos[1] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
              </div>

              <div className="flex flex-col lg:col-span-2">
                <label htmlFor="data" className={`text-sm ${validos[5] ? 'text-white' : 'text-red-500'}`}>Data de Matrícula</label>
                <input
                  type="date"
                  name="data"
                  id="data"
                  value={matricula.data.substr(0, 10)}
                  onChange={manipularMudanca}
                  className={`w-full px-3 py-2 rounded-md bg-gray-800 text-white ${!validos[5] ? 'border border-red-500' : 'border border-gray-300'}`}
                />
                {!validos[5] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
              </div>

              <div className="flex flex-col justify-end lg:col-span-1">
                <button type="submit" className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors">
                  Confirmar
                </button>
              </div>

              <div className="flex flex-col justify-end lg:col-span-1">
                <button
                  type="button"
                  onClick={() => {
                    zeraMatricula();
                    props.setExibirTabela(true);
                  }}
                  className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="ra" className={`text-sm ${validos[4] ? 'text-white' : 'text-red-500'}`}>RA</label>
                <input
                  type="number"
                  id="ra"
                  name="ra"
                  value={matricula.ra}
                  onChange={manipularMudanca}
                  className={`rounded-md p-2 bg-gray-800 text-white ${!validos[4] ? 'border border-red-500' : ''}`}
                />
                {!validos[4] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="nome" className={`text-sm ${validos[3] ? 'text-white' : 'text-red-500'}`}>Nome do aluno</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={matricula.nome}
                  onChange={manipularMudanca}
                  className={`rounded-md p-2 bg-gray-800 text-white ${!validos[3] ? 'border border-red-500' : ''}`}
                />
                {!validos[3] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="cpf" className={`text-sm ${validos[2] ? 'text-white' : 'text-red-500'}`}>CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  maxLength={14}
                  value={matricula.cpf}
                  onChange={manipularMudanca}
                  className={`rounded-md p-2 bg-gray-800 text-white ${!validos[2] ? 'border border-red-500' : ''}`}
                />
                {!validos[2] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
              </div>
            </div>
          </form>

          <div className="mt-6 overflow-y-auto min-h-[40vh] max-h-[40vh]">
            <p className='px-4 py-3  text-2xl text-center font-semibold text-gray-300 uppercase'>Alunos que não possuem  {ano==0?"nenhuma matricula":" matricula em "+nomeAno(ano)}</p>
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">RA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">CPF</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">Data de Nascimento</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">Ação</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/40 divide-y divide-gray-700">
                {Array.isArray(listaFiltrada) && listaFiltrada.length > 0 ? (
                  listaFiltrada.map((aluno) => (
                    <tr key={aluno.ra} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300">{aluno.pessoa.nome}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{aluno.ra}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{aluno.pessoa.cpf}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {new Date(`${aluno.pessoa.dataNascimento}T00:00:00`).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setarValores(aluno)}
                          className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                          Selecionar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-300 py-4">Nenhum aluno encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>

  );
}

export default CadastroMatricula;
