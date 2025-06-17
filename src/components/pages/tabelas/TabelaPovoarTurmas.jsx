import React from "react";
import { CheckCircle, Pencil, Plus } from "lucide-react";

export default function TabelaTurmas({ turmas, confirmarPovoamento, editarTurma }) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          {["SÉRIE", "ANO LETIVO", "LETRA", "SALA", "PROFESSOR", "AÇÕES"].map((t, i) => (
            <th
              key={i}
              className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase bg-gray-100"
            >
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300 bg-white">
        {(turmas ?? []).length > 0 ? (
          turmas.map((turma, index) => (
            <tr key={index} className="hover:bg-gray-200">
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {`${turma.serie.serieNum}º`}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {new Date(turma.anoLetivo.inicio).getFullYear()}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">{turma.letra}</td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {turma.sala?.descricao}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700">
                {turma.profissional?.profissional_usuario}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-700 space-x-2">
                <button
                  onClick={() => editarTurma(turma)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Pencil className="w-6 h-6 inline" /> 
                </button>
                <button
                  onClick={() => confirmarPovoamento(turma)}
                  className="p-2 text-green-300 hover:text-green-900"
                >
                  <Plus className="w-8 h-8 inline" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-red-500 py-4">
              Nenhuma turma encontrada!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}