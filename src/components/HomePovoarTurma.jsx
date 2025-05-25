import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import FormularioPovoarTurma from "./pages/cadastros/FormularioPovarTurma";
import TabelaTurmas from "./pages/tabelas/TabelaTurmas";
import Page from "./layouts/Page"

export default function HomePovoarTurma() {
    const [turmas, setTurmas] = useState([]);
    const [anos, setAnos] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/turma/buscarTodos")
            .then(res => res.json())
            .then(data => setTurmas(data.turmas || []));

        fetch("http://localhost:8080/anoletivo/buscarTodos")
            .then(res => res.json())
            .then(data => setAnos(data.anos || []));
    }, []);

    function carregarTurmas() {
        fetch("http://localhost:8080/turma/buscarTodos")
            .then(res => res.json())
            .then(data => setTurmas(data.turmas || []));
    }

    return (
        <div>
            <Toaster position="top-center" />
            <Page />
            <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-gray-900">
                <div className="w-full max-w-4xl px-4 space-y-8">
                    {!mostrarFormulario && (
                        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Turmas Cadastradas</h2>
                                <button
                                    onClick={() => setMostrarFormulario(true)}
                                    className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg">
                                    <Plus className="w-4 h-4" /> Povoar Turma
                                </button>
                            </div>
                            <TabelaTurmas
                                turmas={turmas}
                                confirmarPovoamento={(turma) => {
                                    setTurmaSelecionada(turma);
                                    setMostrarFormulario(true);
                                }}
                            />

                        </div>
                    )}

                    {mostrarFormulario && turmaSelecionada && (
                        <FormularioPovoarTurma
                            turmaSelecionada={turmaSelecionada}
                            cancelar={() => {
                                setMostrarFormulario(false);
                                setTurmaSelecionada(null);
                                carregarTurmas();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
