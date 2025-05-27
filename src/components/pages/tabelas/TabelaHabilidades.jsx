import { useState, useEffect } from 'react';
import { consultarMateria } from '../../../service/serviceMateria';
import { Pencil, Trash2 } from "lucide-react";

export default function TabelaHabilidade({ habilidades, excluirHabilidade, editarHabilidade }) {
    const [materias, setMaterias] = useState([]);

    useEffect(() => {
        carregarMaterias();
    }, []);

    async function carregarMaterias() {
        try {
            const resultado = await consultarMateria();
            setMaterias(resultado.listaDeMaterias || []);
        } catch (error) {
            console.error('Erro ao carregar matérias:', error);
        }
    }

    function obterNomeMateria(materiaId) {
        const materia = materias.find(m => m.id === materiaId);
        return materia ? materia.nome : 'Matéria não encontrada';
    }

    return (
        <table className="w-full border border-black bg-black">
            <thead className="bg-gray-500">
                <tr>
                    <th className="p-3 text-black">Código</th>
                    <th className="p-3 text-black">Descrição</th>
                    <th className="p-3 text-black">Matéria</th>
                    <th className="p-3 text-black">Série ID</th>
                    <th className="p-3 text-black">Ações</th>
                </tr>
            </thead>
            <tbody>
                {(habilidades ?? []).length > 0 ? (
                    habilidades.map((habilidade) => (
                        <tr key={habilidade.cod} className="border-t border-gray-700">
                            <td className="p-3 text-center">{habilidade.cod}</td>
                            <td className="p-3 text-center">{habilidade.descricao}</td>
                            <td className="p-3 text-center">{obterNomeMateria(habilidade.materia_id)}</td>
                            <td className="p-3 text-center">
                                {habilidade.habilidades_serie_id === 0 ? 'Todas' : habilidade.habilidades_serie_id}
                            </td>
                            <td className="p-3 text-center flex gap-2 justify-center">
                                <button
                                    onClick={() => editarHabilidade(habilidade)}
                                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded"
                                >
                                    <Pencil width={16} height={16} />
                                </button>
                                <button
                                    onClick={() => excluirHabilidade(habilidade)}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
                                >
                                    <Trash2 width={16} height={16} />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="p-3 text-center text-red-600">
                            Nenhuma habilidade encontrada!
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}