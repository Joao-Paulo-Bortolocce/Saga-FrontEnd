import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Pencil } from "lucide-react";
import FormularioPovoarTurma from "./cadastros/FormularioPovarTurma";
import FormularioEditarTurma from "./cadastros/FormularioEditarTurma";
import TabelaTurmas from "./tabelas/TabelaPovoarTurmas";
import Page from "../layouts/Page";

export default function HomePovoarTurma() {
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [modo, setModo] = useState(null); // 'povoar' ou 'editar'

    function carregarTurmas() {
        fetch("http://localhost:8080/turma/buscarTodos")
            .then(res => res.json())
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
            <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-gray-900">
                <div className="w-full max-w-4xl px-4 space-y-8">
                    {!turmaSelecionada && (
                        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Turmas Cadastradas</h2>
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
