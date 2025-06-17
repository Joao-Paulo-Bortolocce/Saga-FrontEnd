import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Trash2, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { buscarNotificacoes, apagarNotificacao, atualizarNotificacao } from "../../../redux/notificacaoReducer";
import ESTADO from "../../../redux/estados";

export default function TabelaNotificacao() {
  const { estado, mensagem, listaDeNotificacoes } = useSelector((state) => state.notificacao);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(buscarNotificacoes());
  }, [dispatch]);

  async function handleSelect(notificacao) {
    if (notificacao && !notificacao.not_visto) {
      dispatch(atualizarNotificacao(notificacao));
    }
  }

  function handleDelete(notificacao) {
    if (window.confirm("Deseja realmente apagar esta notificação?")) {
      dispatch(apagarNotificacao(notificacao));
    }
  }

  if (estado === ESTADO.PENDENTE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="loader">Carregando...</div>
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          {mensagem}
        </div>
      </div>
    );
  }
  if (estado === ESTADO.ERRO) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          {mensagem}
        </div>
        <button
          onClick={() => dispatch(buscarNotificacoes())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Título e Subtítulo */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
            <p className="mt-2 text-sm text-gray-700">Lista de todas as notificações do sistema</p>
          </div>
        </div>

        {/* Campo de busca (se você tiver um filtro de pesquisa) */}
        {/* <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar notificação..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
        </div> */}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensagem</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listaDeNotificacoes.length > 0 ? (
                [...listaDeNotificacoes]
                  .sort((a, b) => new Date(b.not_data) - new Date(a.not_data))
                  .map((notificacao) => (
                    <tr key={notificacao.not_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(notificacao.not_data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {notificacao.not_visto ? (
                          notificacao.not_texto
                        ) : (
                          <span className="italic text-gray-500">Visualizar</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleSelect(notificacao)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          title="Visualizar"
                        >
                          <Eye className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(notificacao)}
                          className="text-red-600 hover:text-red-900"
                          title="Deletar"
                        >
                          <Trash2 className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-center text-red-600">
                    Nenhuma notificação encontrada!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
