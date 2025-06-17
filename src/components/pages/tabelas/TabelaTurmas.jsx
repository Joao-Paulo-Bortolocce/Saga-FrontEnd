import { Trash2 } from "lucide-react";

export default function TabelaTurmas({ turmas, editarTurma, confirmarExclusao }) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-100">
        <tr>
          {["Letra", "Série", "Ano Letivo", "Profissional", "Sala", "Ações"].map((t, i) => (
            <th
              key={i}
              className="px-6 py-4 text-left text-xs font-semibold text-black uppercase"
            >
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white">
        {(turmas ?? []).length > 0 ? (
          turmas.map((turma, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 transition-colors duration-150"
            >
              <td className="px-6 py-4 text-sm text-black">{turma.letra}</td>
              <td className="px-6 py-4 text-sm text-black">
                {turma.serie?.serieNum + "° Série"}
              </td>
              <td className="px-6 py-4 text-sm text-black">
                {new Date(turma.anoLetivo?.inicio).getFullYear()}
              </td>
              <td className="px-6 py-4 text-sm text-black">
                {turma.profissional?.profissional_usuario || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-black">
                {turma.sala?.descricao || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-black text-right">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => confirmarExclusao(turma)}
                    className="p-1.5 rounded-lg text-red-600 hover:text-red-900/30"
                  >
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-red-600 py-4">
              Nenhuma turma encontrada.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}