
import React, { useEffect, useState } from 'react';
import logoPrefeitura from "../../../assets/images/logoPrefeitura.png";
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados.js';
import { incluirMatricula, atualizarMatricula } from '../../../redux/matriculaReducer.js';
import { listaDeanosLetivos } from '../../../mockDados/mockAnoLetivo.js';
import { listaDeSeries } from '../../../mockDados/mockSeries.js';
import toast, { Toaster } from "react-hot-toast";
import { buscarAlunos } from '../../../redux/alunoReducer.js';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formatarCPF } from "../../../service/formatadores.js"


function CadastroMatricula(props) {
  const [matricula, setMatricula] = useState(props.matricula);
  const { estado, mensagem, listaDeAlunos } = useSelector(state => state.aluno);
  const dispachante = useDispatch();
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [lenCpf, setLenCpf] = useState(0);

  useEffect(() => {
    dispachante(buscarAlunos())
  }, [])

  function manipularMudanca(event) {
    const id = event.currentTarget.id;
    const valor = event.currentTarget.value;
    if (id == 'cpf') {
      const aux = document.getElementById("cpf").value;
      const result = formatarCPF(aux, aux.length > lenCpf);
      document.getElementById("cpf").value = result;
      setLenCpf(result.length);
    }
    else {
      if (id != "nome")
        setMatricula({ ...matricula, [id]: valor });
    }

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

      const filtroRA = ra == 0 || raAluno.includes(ra);
      const filtroNome = nome === "" || nomeAluno.includes(nome);
      const filtroCPF = cpf === "" || cpfAluno.includes(cpf);

      return filtroRA && filtroNome && filtroCPF;
    });
    setListaFiltrada(novaListaFiltrada);
  }

  function setAlunos() {
    setListaFiltrada(listaDeAlunos)
  }

  function setarValores(aluno) {
    document.getElementById("cpf").value = aluno.pessoa.cpf
    document.getElementById("nome").value = aluno.pessoa.nome
    setMatricula({ ...matricula, ["ra"]: aluno.ra });
  }


  function zeraMatricula() {
    props.setMatricula({
      ra: "",
      anoLetivo_id: 0,
      serie_id: 0
    });
  }

  function handleSubmit(evento) {
    if (props.modoEdicao) {
      dispachante(atualizarMatricula(matricula));
      props.setExibirTabela(true);
      props.setModoEdicao(false);
      zeraMatricula();
    } else {
      dispachante(incluirMatricula(matricula));
      props.setExibirTabela(true);
      zeraMatricula();
    }

    evento.stopPropagation();
    evento.preventDefault();
  }

  function buscarPessoa() {
    let aluno = listaDeAlunos.filter((alunoAux) => {
      if (matricula.ra == alunoAux.aluno_ra)
        return alunoAux;
    })
    if (Array.isArray(aluno) && aluno.length != 1)
      toast.error("RA informado é invalido", { duration: 5000, repeat: false });
    else {
      dispachante(buscarPessoas(aluno[0].aluno_pessoa_cpf));
      let pessoa = listaDePessoas[0];
      document.getElementById("nome").value = pessoa.pessoa_nome;
      document.getElementById("cpf").value = pessoa.pessoa_cpf;
    }
  }

  if (estado === ESTADO.PENDENTE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">{mensagem}</div>
      </div>
    );
  }
  else if (estado === ESTADO.ERRO) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <AlertCircle className="w-5 h-5 mr-2" />
          {mensagem}
        </div>
        <button
          onClick={() => dispatch(buscarMatriculas())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
      onLoad={setAlunos}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-4xl max-h-[100vh] overflow-hidden">
        <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 h-full flex flex-col">
          <div className="flex flex-col justify-around flex-shrink-0">
            <div className="flex flex-col items-center mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-wide">
                Registro de Matricula
              </h2>
              <img
                src={logoPrefeitura}
                alt="Logo da Prefeitura"
                className="h-16 sm:h-20 md:h-24 w-auto"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="anoLetivo_id" className="text-white">Ano letivo</label>
                  <select id="anoLetivo_id" name="anoLetivo_id" value={matricula.anoLetivo_id} onChange={manipularMudanca}
                    className="rounded-md p-2 bg-gray-800 text-white">
                    <option value="0">Selecione</option>
                    {listaDeanosLetivos.map((ano) => (
                      <option key={ano.anoletiv} value={ano.anoletiv}>{ano.anoletiv}</option>
                    ))}
                  </select>
                </div>
  
                <div className="flex flex-col">
                  <label htmlFor="serie_id" className="text-white">Série</label>
                  <select id="serie_id" name="serie_id" value={matricula.serie_id} onChange={manipularMudanca}
                    className="rounded-md p-2 bg-gray-800 text-white">
                    <option value="0">Selecione</option>
                    {listaDeSeries.map((serie) => (
                      <option key={serie.numero} value={serie.numero}>{serie.descricao}</option>
                    ))}
                  </select>
                </div>
  
                <div className="flex flex-col justify-end">
                  <button type="submit"
                    className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors">
                    Confirmar
                  </button>
                </div>
  
                <div className="flex flex-col justify-end">
                  <button type="button" onClick={() => {
                    zeraMatricula();
                    props.setExibirTabela(true);
                  }}
                    className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                    Voltar
                  </button>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="ra" className="text-white">RA</label>
                  <input type="number" id="ra" value={matricula.ra} onChange={manipularMudanca}
                    className="w-full rounded-md p-2 bg-gray-800 text-white" />
                </div>
                <div>
                  <label htmlFor="nome" className="text-white">Nome do aluno</label>
                  <input type="text" id="nome" onChange={manipularMudanca}
                    className="w-full rounded-md p-2 bg-gray-800 text-white" />
                </div>
                <div>
                  <label htmlFor="cpf" className="text-white">CPF</label>
                  <input type="text" id="cpf" maxLength={14} onChange={manipularMudanca}
                    className="w-full rounded-md p-2 bg-gray-800 text-white" />
                </div>
              </div>
            </form>
          </div>
  
          {/* Tabela com rolagem independente */}
          <div className="mt-6 overflow-y-auto max-h-[40vh]">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">
                    RA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">
                    CPF
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase bg-gray-800">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/40 divide-y divide-gray-700">
                {Array.isArray(listaFiltrada) && listaFiltrada.length > 0 ? (
                  listaFiltrada.map((aluno) => (
                    <tr key={aluno.ra} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300">{aluno.pessoa.nome}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{aluno.ra}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{aluno.pessoa.cpf}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setarValores(aluno)}
                          className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition">
                          Selecionar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-300 py-4">
                      Nenhum aluno encontrado
                    </td>
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