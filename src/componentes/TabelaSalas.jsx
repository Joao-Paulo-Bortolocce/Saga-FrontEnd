export default function TabelaSalas({ salas, excluirSalas, editarSalas }) {
    return (
      <table className="w-full border border-black bg-black">
        <thead className="bg-gray-500">
          <tr>
            <th className="p-3 text-black">ID</th>
            <th className="p-3 text-black">Carteira</th>
            <th className="p-3 text-black">Ações</th>
          </tr>
        </thead>
        <tbody>
          {(salas ?? []).length > 0 ? (
            salas.map((salas) => (
              <tr key={salas.id} className="border-t border-gray-700">
                <td className="p-3 text-center">{salas.id}</td>
                <td className="p-3 text-center">{salas.ncarteiras}</td>
                <td className="p-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editarSalas(salas)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirSalas(salas)}
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
                Nenhuma sala cadastrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }