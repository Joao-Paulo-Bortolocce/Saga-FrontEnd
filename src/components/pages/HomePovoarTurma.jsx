import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Pencil } from "lucide-react";
import FormularioPovoarTurma from "../../components/pages/cadastros/FormularioPovoarTurma";
import FormularioEditarTurma from "../../components/pages/cadastros/FormularioEditarTurma";
import TabelaTurmas from "./tabelas/TabelaPovoarTurmas";
import Page from "../layouts/Page";

export default function HomePovoarTurma() {
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [modo, setModo] = useState(null); // 'povoar' ou 'editar'

    function carregarTurmas() {
        fetch("http://localhost:8080/turma/buscarTodos", {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao carregar turmas");
                return res.json();
            })
            .then(data => setTurmas(data.turmas || []))
            .catch(() => toast.error("Erro ao carregar turmas"));
    }

    useEffect(() => {
        carregarTurmas();
    }, []);

    return (
        <div>
            <Toaster position="top-center" />
            <Page />
            <div
                className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}
            >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 w-full max-w-4xl px-4 space-y-8">
                    {!turmaSelecionada && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 w-full border border-gray-300">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-black">Turmas Cadastradas</h2>
                            </div>
                            <TabelaTurmas
                                turmas={turmas}
                                confirmarPovoamento={(turma) => {
                                    setTurmaSelecionada(turma);
                                    setModo("povoar");
                                }}
                                editarTurma={(turma) => {
                                    setTurmaSelecionada(turma);
                                    setModo("editar");
                                }}
                            />
                        </div>
                    )}

                    {turmaSelecionada && modo === "povoar" && (
                        <FormularioPovoarTurma
                            turmaSelecionada={turmaSelecionada}
                            cancelar={() => {
                                setTurmaSelecionada(null);
                                setModo(null);
                                carregarTurmas();
                            }}
                        />
                    )}

                    {turmaSelecionada && modo === "editar" && (
                        <FormularioEditarTurma
                            turmaSelecionada={turmaSelecionada}
                            cancelar={() => {
                                setTurmaSelecionada(null);
                                setModo(null);
                                carregarTurmas();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
