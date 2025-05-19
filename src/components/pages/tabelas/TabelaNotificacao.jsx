import { useState, useEffect } from 'react';
import { VisualizarNotificacao, consultarNotificacao, excluirNotificacao } from '../../../service/serviceNotificacao.js';
import { TrashIcon } from '@heroicons/react/24/solid'; // usando Heroicons como exemplo

export default function TabelaNotificacao() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  async function fetchNotificacoes() {
    const lista = await consultarNotificacao();
    setNotificacoes(lista ?? []);
  }

  async function handleSelect(id) {
  await VisualizarNotificacao(id);
  setNotificacoes(prev =>
    prev.map(notif =>
      notif.not_id === id ? { ...notif, not_visto: true } : notif
    )
  );
}

  async function handleDelete(id) {
    if (confirm("Deseja realmente apagar esta notificação?")) {
      const resposta = await excluirNotificacao(id);
      if (resposta.status) {
        alert("Notificação apagada com sucesso!");
        fetchNotificacoes();
      } else {
        alert("Erro ao apagar notificação!");
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-900 rounded-2xl shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-6">Notificações</h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Mensagem do dia</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Apagar</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Mensagem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <tr
                key={notificacao.not_id}
                className="cursor-pointer hover:bg-gray-700"
              >
                <td className="px-10 py-4" onClick={() => handleSelect(notificacao.not_id)}>
                  {new Date(notificacao.not_data).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(notificacao.not_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
                <td className="px-6 py-4" onClick={() => handleSelect(notificacao.not_id)}>
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
