export default function TabelaReuniao({ reunioes, editarReuniao, confirmarExclusao }) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-100">
        <tr>
          {['ID', 'LETRA', 'SÉRIE', 'ANO LETIVO', 'DATA', 'TIPO', 'AÇÕES'].map((t, i) => (
            <th
              key={i}
              className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase"
            >
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {(reunioes ?? []).length > 0 ? (
          reunioes.map((reuniao) => (
            <tr
              key={reuniao.reuniaoId}
              className="hover:bg-gray-100 transition-colors duration-150"
            >
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {reuniao.reuniaoId}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {reuniao.turma.letra}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {`${reuniao.serie.serieNum}° Série`}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {new Date(reuniao.anoLetivo.inicio).getFullYear()}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {(() => {
                  const data = new Date(reuniao.reuniaoData);
                  data.setHours(data.getHours() + 3); // Ajuste fuso horário
                  return data.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                })()}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {reuniao.reuniaoTipo}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => editarReuniao(reuniao)}
                    className="p-1.5 text-blue-600 hover:text-blue-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                  </button>
                  <button
                    onClick={() => confirmarExclusao(reuniao.reuniaoId)}
                    className="p-1.5 text-red-600 hover:text-red-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="7"
              className="text-center text-red-500 py-4 font-medium"
            >
              Nenhuma reunião encontrada!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
