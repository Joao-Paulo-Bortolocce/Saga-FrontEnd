import React, { useState, useEffect } from "react";
import { consultarMateria, excluirMateria, alterarMateria } from "../../../service/serviceMateria.js";
import { Pencil, Trash2, Search , Plus} from "lucide-react";
import Page from "../../layouts/Page.jsx";
import { useNavigate } from "react-router-dom";

export default function TabelaMateria() {

    const navigate = useNavigate();
    const [listaMaterias, setListaMaterias] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        async function carregarMaterias() {
            try {
                const materias = await consultarMateria();
                setListaMaterias(materias.listaDeMaterias);
                console.log(materias)
            } catch (erro) {
                console.error("Erro ao carregar matérias:", erro);
            }
        }
        carregarMaterias();
    }, []);

    const filteredMaterias = listaMaterias.filter(materia =>
        materia.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function deleteSubject(materia) {
        if (window.confirm("Deseja realmente excluir a matéria " + materia.nome + "?")) {
            await excluirMateria(materia);
            const listaMatAtualizada = await consultarMateria();
            setListaMaterias(listaMatAtualizada);
            toast.success("Matéria excluída com sucesso!");
        }
    }

    function changeSubject(materiaSelecionada) {
        setMateria(materiaSelecionada);
        setErrors({ nome: "", carga: "" })
    }

    return (
        <div>
            <Page />
            <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 w-full max-w-4xl px-4 space-y-8">
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                Matérias Cadastradas
                            </h2>
                            <button onClick={() => navigate("cad-materia")} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg">
                                <Plus className="w-4 h-4" /> Cadastrar
                            </button>
                        </div>
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Pesquisar matéria por nome..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-700 rounded-lg bg-gray-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-gray-700">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider bg-gray-800/80">
                                            Id
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider bg-gray-800/80">
                                            Nome
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider bg-gray-800/80">
                                            Carga Horária
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider bg-gray-800/80 w-24">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800/40">
                                    {filteredMaterias.map((materia, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-700/40 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                                                {materia.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {materia.nome}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {materia.carga}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => changeSubject(materia)}
                                                        className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil width={16} height={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSubject(materia)}
                                                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 width={16} height={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredMaterias.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-red-400 py-4">Nenhuma matéria encontrada.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}