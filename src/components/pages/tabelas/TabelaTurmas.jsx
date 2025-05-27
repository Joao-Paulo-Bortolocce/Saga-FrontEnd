import { Trash } from "lucide-react";

export default function TabelaTurmas({ turmas, editarTurma, confirmarExclusao }) {
  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead>
        <tr>
          {["LETRA", "SÉRIE", "ANO LETIVO", "PROFISSIONAL", "SALA", "AÇÕES"].map((t, i) => (
            <th key={i} className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase bg-gray-800/80">
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700 bg-gray-800/40">
        {(turmas ?? []).length > 0 ? (
          turmas.map((turma, index) => (
            <tr key={index} className="hover:bg-gray-700/40">
              <td className="px-6 py-4 text-sm text-center text-gray-300">{turma.letra}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">
                {turma.serie?.serieNum + '° Série'}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">
                {new Date(turma.anoLetivo?.inicio).getFullYear()}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">
                {turma.profissional?.profissional_usuario || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">
                {turma.sala?.descricao || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">
                <button
                  onClick={() => confirmarExclusao(turma)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  <Trash/>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-red-400 py-4">
              Nenhuma turma encontrada!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}