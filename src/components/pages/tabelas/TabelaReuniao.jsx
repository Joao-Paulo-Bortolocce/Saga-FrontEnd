export default function TabelaReuniao({ reunioes, editarReuniao, excluirReuniao }) {
  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead>
        <tr>
          {['ID', 'LETRA', 'SÉRIE', 'ANO LETIVO', 'DATA', 'TIPO', 'AÇÕES'].map((t, i) => (
            <th key={i} className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700 bg-gray-800/40">
        {(reunioes ?? []).length > 0 ? (
          reunioes.map((reuniao) => (
            <tr key={reuniao.reuniaoId} className="hover:bg-gray-700/40">
              <td className="px-6 py-4 text-sm text-center text-gray-300">{reuniao.reuniaoId}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">{reuniao.turma.letra}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">{`${reuniao.serie.serieNum}° Série`}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">{new Date(reuniao.anoLetivo.inicio).getFullYear()}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">
              {(() => {
                const data = new Date(reuniao.reuniaoData);
                data.setHours(data.getHours() + 3); // Ajuste fuso horário
                return data.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
              })()}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">{reuniao.reuniaoTipo}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">
                <button onClick={() => editarReuniao(reuniao)} className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Editar</button>{' '}
                <button onClick={() => excluirReuniao(reuniao.reuniaoId)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20">Excluir</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center text-red-400 py-4">Nenhuma reunião encontrada!</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
