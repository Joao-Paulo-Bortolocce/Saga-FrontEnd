import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, Search, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados';
import { apagarAluno, buscarAlunos } from '../../../redux/alunoReducer';

export default function TabelaAluno(props) {
  const { estado, mensagem, listaDeAlunos } = useSelector(state => state.aluno);
  const dispatch = useDispatch();
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    dispatch(buscarAlunos());
  }, [dispatch]);

  function excluirAluno(aluno) {
    if (window.confirm(`Deseja realmente excluir ${aluno.pessoa.nome}?`)) {
      dispatch(apagarAluno(aluno));
    }
  }

  function alterarAluno(aluno) {
    props.setModoEdicao(true);
    props.setExibirTabela(false);
    props.setAluno(aluno)
  }

  const alunosFiltrados = listaDeAlunos.filter(aluno =>
    aluno.pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

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
          onClick={() => dispatch(buscarAlunos())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className=" py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cadastro de Alunos</h1>
            <p className="mt-2 text-sm text-gray-700">Lista de todas as matriculas cadastradas no sistema</p>
          </div>
          <button
            onClick={() => props.setExibirTabela(false)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4 mr-2" /> Novo Aluno
          </button>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar matriculas..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data de Nascimento</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alunosFiltrados.map((aluno) => (
                  <tr key={aluno.ra}>
                    <td className="px-6 py-4 whitespace-nowrap">{aluno.ra}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{aluno.pessoa.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{aluno.pessoa.cpf}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(aluno.pessoa.dataNascimento).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => alterarAluno(aluno)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button onClick={() => excluirAluno(aluno)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}