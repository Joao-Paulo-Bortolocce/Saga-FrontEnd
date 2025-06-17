import React, { useEffect, useState, useContext } from 'react';
import {
  Pencil, Trash2, Search, UserPlus, AlertCircle, Loader2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados';
import {
  apagarProfissional,
  buscarProfissionais
} from '../../../redux/profissionalReducer';
import { ContextoUsuario } from '../../../App';

export default function TabelaProfissional(props) {
  const { estado, mensagem, listaDeProfissionais } = useSelector(state => state.profissional);
  const { setUsuario, usuario } = useContext(ContextoUsuario);
  const dispatch = useDispatch();
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    dispatch(buscarProfissionais());
  }, [dispatch]);

  const profissionaisFiltrados = listaDeProfissionais.filter(profissional =>
    profissional.profissional_pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const getTipoProfissional = (tipo) => {
    switch (tipo) {
      case 1: return "Secretaria";
      case 2: return "Professor";
      case 3: return "Gestão";
      default: return "Não definido";
    }
  };

  function excluirProfissional(profissional) {
    if (window.confirm(`Deseja realmente excluir ${profissional.profissional_pessoa.nome}?`)) {
      dispatch(apagarProfissional(profissional));
    }
  }

  function alterarProfissional(profissional) {
    props.setModoEdicao(true);
    props.setExibirTabela(false);
    props.setProfissional(profissional);
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
          onClick={() => dispatch(buscarProfissionais())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cadastro de Profissionais</h1>
            <p className="mt-2 text-sm text-gray-700">Lista de todos os profissionais cadastrados no sistema</p>
          </div>
          <button
            onClick={() => props.setExibirTabela(false)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4 mr-2" /> Novo Profissional
          </button>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar profissionais..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admissão</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                  {usuario.tipo === 3 && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profissionaisFiltrados.length > 0 ? (
                  profissionaisFiltrados.map((profissional) => (
                    <tr key={profissional.profissional_rn}>
                      <td className="px-6 py-4 whitespace-nowrap">{profissional.profissional_rn}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{profissional.profissional_pessoa.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{profissional.profissional_pessoa.cpf}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getTipoProfissional(profissional.profissional_tipo)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(profissional.profissional_dataAdmissao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{profissional.profissional_usuario}</td>
                      {usuario.tipo === 3 && (
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => alterarProfissional(profissional)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Editar"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => excluirProfissional(profissional)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={usuario.tipo === 3 ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum profissional encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
