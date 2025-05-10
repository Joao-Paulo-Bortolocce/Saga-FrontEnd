export default function TabelaSerie({ series, excluirSerie, editarSerie }) {
  return (
    <table className="w-full border border-black bg-black">
      <thead className="bg-gray-500">
        <tr>
          <th className="p-3 text-black">ID</th>
          <th className="p-3 text-black">Série</th>
          <th className="p-3 text-black">Descrição</th>
          <th className="p-3 text-black">Ações</th>
        </tr>
      </thead>
      <tbody>
        {(series ?? []).length > 0 ? (
          series.map((serie) => (
            <tr key={serie.id} className="border-t border-gray-700">
              <td className="p-3 text-center">{serie.id}</td>
              <td className="p-3 text-center">{serie.serieNum}</td>
              <td className="p-3 text-center">{serie.descricao}</td>
              <td className="p-3 text-center flex gap-2 justify-center">
                <button
                  onClick={() => editarSerie(serie)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded"
                >
                  Alterar
                </button>
                <button
                  onClick={() => excluirSerie(serie)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="p-3 text-center text-red-600">
              Nenhuma série encontrada!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
