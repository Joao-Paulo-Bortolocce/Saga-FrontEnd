import { seriesDescricaoPorNumero } from "../../../mockDados/mockReunioes.js";

export default function TabelaReuniao({ reunioes, editarReuniao, excluirReuniao }) {
  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="">
        <tr>
          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">ID</th>
          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Letra</th>
          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Série</th>
          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Ano Letivo</th>
          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Data</th>
          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700 bg-gray-800/40">
        {(reunioes ?? []).length > 0 ? (
          reunioes.map((reuniao) => (
            <tr key={reuniao.id} className="hover:bg-gray-700/40 transition-colors duration-150">
              <td className="px-6 py-4 text-sm text-gray-300 text-center">{reuniao.id}</td>
              <td className="px-6 py-4 text-sm text-gray-300 text-center">{reuniao.turmaLetra}</td>
              <td className="px-6 py-4 text-sm text-gray-300 text-center">
                {seriesDescricaoPorNumero[reuniao.turmaSerieId] ?? `Série ${reuniao.turmaSerieId}`}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 text-center" text-center>{reuniao.turmaAnoletivoId}</td>
              <td className="px-6 py-4 text-sm text-gray-300 text-center">
                {new Date(reuniao.data).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 text-center">
                <button onClick={() => editarReuniao(reuniao)} className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-400">
                  Editar
                </button> <button onClick={() => excluirReuniao(reuniao)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400">
                  Excluir
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-red-400 py-4">
              Nenhuma reunião encontrada!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
