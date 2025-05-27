import React from "react";
import { CheckCircle, Pencil, Plus } from "lucide-react";

export default function TabelaTurmas({ turmas, confirmarPovoamento, editarTurma }) {
  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead>
        <tr>
          {["SÉRIE", "ANO LETIVO", "LETRA", "SALA", "PROFESSOR", "AÇÕES"].map((t, i) => (
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
              <td className="px-6 py-4 text-sm text-center text-gray-300">
                {`${turma.serie.serieNum}º`}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">
                {new Date(turma.anoLetivo.inicio).getFullYear()}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">{turma.letra}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">{turma.sala?.descricao}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300">{turma.profissional?.profissional_usuario}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-300 space-x-2">
                <button
                  onClick={() => editarTurma(turma)}
                  className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                >
                  <Pencil className="w-4 h-4 inline" /> Editar
                </button>
                <button
                  onClick={() => confirmarPovoamento(turma)}
                  className="p-1.5 rounded-lg bg-green-600/10 text-green-400 hover:bg-green-500/20"
                >
                  <Plus className="w-4 h-4 inline" /> Povoar
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
