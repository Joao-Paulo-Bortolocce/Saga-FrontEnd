import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
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
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-900 rounded-2xl shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-6">Notificações</h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Data</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Apagar</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Mensagem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {listaDeNotificacoes.length > 0 ? (
            listaDeNotificacoes.map((notificacao) => (
              <tr key={notificacao.not_id} className="cursor-pointer hover:bg-gray-700">
                <td className="px-10 py-4">
                  {notificacao.not_data}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(notificacao)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
                <td className="px-6 py-4" onClick={() => handleSelect(notificacao)}>
                  {notificacao.not_visto ? notificacao.not_texto : "Visualizar"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-red-500">
                Nenhuma notificação encontrada!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
