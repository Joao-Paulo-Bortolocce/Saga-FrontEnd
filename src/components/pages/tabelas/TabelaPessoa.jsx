import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, Search, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { apagarPessoa, buscarPessoas } from '../../../redux/pessoaReducer';
import ESTADO from '../../../redux/estados';

export default function TabelaPessoa({ setModoEdicao, setExibirTabela, setPessoa }) {
  const { estado, mensagem, listaDePessoas } = useSelector(state => state.pessoa);
  const dispatch = useDispatch();
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    dispatch(buscarPessoas());
  }, [dispatch]);

  function excluirPessoa(pessoa) {
    if (window.confirm(`Deseja realmente excluir ${pessoa.nome}?`)) {
      dispatch(apagarPessoa(pessoa));
    }
  }

  function alterarPessoa(pessoa) {
    setModoEdicao(true);
    setExibirTabela(false);
    setPessoa({ ...pessoa, enderecoId: 1 });
  }

  const pessoasFiltradas = listaDePessoas.filter(pessoa =>
    pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase())
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
          onClick={() => dispatch(buscarPessoas())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cadastro de Pessoas</h1>
            <p className="mt-2 text-sm text-gray-700">Lista de todas as pessoas cadastradas no sistema</p>
          </div>
          <button
            onClick={() => setExibirTabela(false)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4 mr-2" /> Nova Pessoa
          </button>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar pessoas..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data de Nascimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sexo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado Civil</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pessoasFiltradas.map((pessoa) => (
                  <tr key={pessoa.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{pessoa.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pessoa.cpf}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pessoa.rg}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(pessoa.dataNascimento).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pessoa.sexo === 'M' ? 'Masculino' : 'Feminino'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pessoa.estadoCivil}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => alterarPessoa(pessoa)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button onClick={() => excluirPessoa(pessoa)} className="text-red-600 hover:text-red-900">
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