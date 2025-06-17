import React, { useState, useEffect } from "react";
import Page from "../../layouts/Page.jsx"
import { consultarMateria, excluirMateria } from "../../../service/serviceMateria.js";
import { Pencil, Trash2, Search, Plus, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function TabelaMateria() {
    const navigate = useNavigate();
    const [listaMaterias, setListaMaterias] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        carregarMaterias();
    }, []);

    async function carregarMaterias() {
        try {
            setLoading(true);
            setError(null);
            const result = await consultarMateria();
            setListaMaterias(result.listaDeMaterias || []);
        } catch (erro) {
            console.error("Erro ao carregar matérias:", erro);
            setError("Erro ao carregar matérias!");
            toast.error("Erro ao carregar matérias!");
        } finally {
            setLoading(false);
        }
    }

    const filteredMaterias = listaMaterias.filter(materia =>
        materia.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function deleteSubject(materia) {
        if (window.confirm("Deseja realmente excluir a matéria " + materia.nome + "?")) {
            try {
                await excluirMateria(materia);
                await carregarMaterias(); // Recarrega a lista após exclusão
                toast.success("Matéria excluída com sucesso!");
            } catch (erro) {
                console.error("Erro ao excluir matéria:", erro);
                toast.error("Erro ao excluir matéria!");
            }
        }
    }

    function editSubject(materiaSelecionada) {
        // Navega para a página de edição passando a matéria como state
        navigate("cad-materia", {
            state: {
                materiaParaEdicao: {
                    materia_id: materiaSelecionada.id,
                    materia_nome: materiaSelecionada.nome,
                    materia_carga: materiaSelecionada.carga
                }
            }
        });
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">Carregando matérias...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
                <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
                <button
                    onClick={() => carregarMaterias()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <>
        <Page />
            <div>
                <Toaster position="top-center" />
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Cadastro de Matérias</h1>
                                <p className="mt-2 text-sm text-gray-700">Lista de todas as matérias cadastradas no sistema</p>
                            </div>
                            <button
                                onClick={() => navigate("cad-materia")}
                                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Nova Matéria
                            </button>
                        </div>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pesquisar matérias..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="mt-6 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carga Horária</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredMaterias.map((materia, index) => (
                                            <tr key={materia.id || index}>
                                                <td className="px-6 py-4 whitespace-nowrap">{materia.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{materia.nome}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{materia.carga}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => editSubject(materia)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        <Pencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSubject(materia)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredMaterias.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                    Nenhuma matéria encontrada.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}