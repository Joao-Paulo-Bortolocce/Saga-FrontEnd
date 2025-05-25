import React, { useEffect, useState } from "react";
import { Timer, BookOpen } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import logoPrefeitura from "../../assets/images/logoPrefeitura.png"
import { useNavigate } from "react-router-dom";

export default function HomeMateria() {

    const navigate = useNavigate();
    const [materia, setMateria] = useState({
        materia_id: 0,
        materia_nome: "",
        materia_carga: null
    });

    const [errors, setErrors] = useState({
        materia_nome: "",
        materia_carga: ""
    });

    const [listaMaterias, setListaMaterias] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function carregarMaterias() {
            try {
                const materias = await consultarMateria();
                setListaMaterias(materias);
            } catch (erro) {
                console.error("Erro ao carregar matérias:", erro);
            }
        }
        carregarMaterias();
    }, []);

    const filteredMaterias = listaMaterias.filter(materia =>
        materia.materia_nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function deleteSubject(materia) {
        if (window.confirm("Deseja realmente excluir a matéria " + materia.materia_nome + "?")) {
            await excluirMateria(materia);
            const listaMatAtualizada = await consultarMateria();
            setListaMaterias(listaMatAtualizada);
            toast.success("Matéria excluída com sucesso!");
        }
    }

    function validateForm() {
        let isValid = true;
        const newErrors = {
            materia_nome: "",
            materia_carga: ""
        };

        if (!materia.materia_nome.trim()) {
            newErrors.materia_nome = "O nome da matéria é obrigatório";
            isValid = false;
        }

        if (materia.materia_carga === null || materia.materia_carga <= 0) {
            newErrors.materia_carga = "A carga horária deve ser maior que zero";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    function handleChange(evento) {
        const { name, value } = evento.target;

        if (name === "materia_nome") {
            if (/\d/.test(value)) {
                setErrors(prev => ({
                    ...prev,
                    materia_nome: "O nome da matéria não pode conter números"
                }));
                return;
            } else {
                setErrors(prev => ({
                    ...prev,
                    materia_nome: ""
                }));
            }
        }

        setMateria((prev) => ({
            ...prev,
            [name]: value === "" ? null : value,
        }));
    }

    async function handleSubmit(evento) {
        evento.preventDefault();
        evento.stopPropagation();

        if (!validateForm()) {
            toast.dismiss();
            toast.error("Por favor, preencha todos os campos corretamente!", { duration: 2000, repeat: false });
        } else {
            try {
                if (materia.materia_id > 0) {
                    await alterarMateria(materia);
                    toast.success("Matéria alterada com sucesso!");
                } else {
                    await gravarMateria(materia);
                    toast.success("Matéria cadastrada com sucesso!");
                }
                setMateria({ materia_id: 0, materia_nome: "", materia_carga: null });
                const materiasAtualizadas = await consultarMateria();
                setListaMaterias(materiasAtualizadas);
            } catch (erro) {
                toast.error("Erro ao salvar matéria!");
                console.error("Erro ao gravar matéria:", erro);
            }
        }
    }

    function changeSubject(materiaSelecionada) {
        setMateria(materiaSelecionada);
        setErrors({ materia_nome: "", materia_carga: "" })
    }

    return (
        <>
            <Toaster position="top-center"></Toaster>
            <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 w-full max-w-4xl px-4 space-y-8">
                    <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
                        <div className="flex flex-col items-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">
                                {materia.materia_id > 0 ? "Editar Matéria" : "Cadastro de Matéria"}
                            </h2>
                            <img
                                src={logoPrefeitura}
                                alt="Logo da Prefeitura"
                                className="h-24 w-auto"
                            />
                        </div>
                        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="materia_carga" className="flex items-center gap-2 text-sm font-medium text-white mb-1">
                                        <Timer className="w-4 h-4" />
                                        Carga Horária
                                    </label>
                                    <input type="number"
                                        name="materia_carga"
                                        id="materia_carga"
                                        className={`w-full px-4 py-2 border rounded-lg ${errors.materia_carga
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-red-500"
                                            }`}
                                        placeholder="Digite a carga"
                                        value={materia.materia_carga || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.materia_carga && (
                                        <p className="mt-1 text-sm text-red-500">{errors.materia_carga}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="materia_nome"
                                        className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        name="materia_nome"
                                        id="materia_nome"
                                        className={`w-full px-4 py-2 border rounded-lg bg-white ${errors.materia_nome
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-red-500"
                                            }`}
                                        placeholder="Digite o nome"
                                        value={materia.materia_nome}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.materia_nome && (
                                        <p className="mt-1 text-sm text-red-500">{errors.materia_nome}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                            >
                                {materia.materia_id > 0 ? "Alterar" : "Confirmar"}
                            </button>
                            <button className="w-full bg-gray-600 hover:bg-gray-700 transition-colors text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2" onClick={() => navigate("/cadastros/materia")}>Voltar</button>
                        </form>
                    </div>
                </div>
            </div >
        </>
    )

}