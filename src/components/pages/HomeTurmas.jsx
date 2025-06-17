import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Page from "../layouts/Page";
import FormularioTurma from "./cadastros/FormularioTurma";
import TabelaTurmas from "./tabelas/TabelaTurmas";

import {
    buscarTodasTurmas,
    gravarTurma,
    excluirTurma,
} from "../../service/turmaService";

export default function HomeTurmas() {
    const [turmas, setTurmas] = useState([]);
    const [turmaEmEdicao, setTurmaEmEdicao] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [busca, setBusca] = useState("");

    useEffect(() => {
        async function carregar() {
            const resposta = await buscarTodasTurmas();
            if (resposta.status) {
                setTurmas(resposta.turmas);
            } else {
                toast.error(resposta.mensagem);
            }
        }
        carregar();
    }, []);

    function criarTurma() {
        setTurmaEmEdicao({
            turmaLetra: "",
            serie_id: "",
            anoletivo_id: "",
            profissional_rn: "",
            sala_id: "",
        });
        setMostrarFormulario(true);
    }

    function editarTurma(turma) {
        setTurmaEmEdicao({
            letraAtual: turma.letra,
            novaLetra: turma.letra,
            turmaLetra: turma.letra,
            serie_id: turma.serie.serieId,
            anoletivo_id: turma.anoLetivo.id,
            profissional_rn: turma.profissional.profissional_rn,
            sala_id: turma.sala.id,
        });
        setMostrarFormulario(true);
    }

    function cancelarEdicao() {
        setTurmaEmEdicao(null);
        setMostrarFormulario(false);
    }

    function salvarTurma(turma, emEdicao) {
        const dados = emEdicao
            ? {
                letraAtual: turma.letraAtual,
                novaLetra: turma.novaLetra,
                serie_id: turma.serie_id,
                anoletivo_id: turma.anoletivo_id,
                profissional_rn: turma.profissional_rn,
                sala_id: turma.sala_id,
            }
            : {
                turmaLetra: turma.turmaLetra,
                serie_id: turma.serie_id,
                anoletivo_id: turma.anoletivo_id,
                profissional_rn: turma.profissional_rn,
                sala_id: turma.sala_id,
            };

        const acao = emEdicao ? alterarTurma(dados) : gravarTurma(dados);

        toast.promise(
            acao.then(async (res) => {
                if (!res.status) throw new Error(res.mensagem || "Erro");
                const atualizadas = await buscarTodasTurmas();
                setTurmas(atualizadas.turmas);
                cancelarEdicao();
            }),
            {
                loading: emEdicao ? "Atualizando..." : "Cadastrando...",
                success: emEdicao ? "Turma atualizada!" : "Turma cadastrada!",
                error: "Erro ao salvar turma",
            }
        );
    }

    function confirmarExclusao(turma) {
        toast.custom((t) => (
            <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg flex flex-col gap-2 border border-red-600 w-[280px]">
                <span className="text-sm">Deseja excluir esta turma?</span>
                <div className="flex justify-end gap-2 text-sm">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const resposta = await excluirTurma(
                                turma.letra,
                                turma.serie.serieId,
                                turma.anoLetivo.id,
                                turma.profissional.profissional_rn,
                                turma.sala.id
                            );
                            if (resposta.status) {
                                toast.success("Turma excluída com sucesso!");
                                const atualizadas = await buscarTodasTurmas();
                                setTurmas(atualizadas.turmas);
                            } else {
                                toast.error("Erro ao excluir turma");
                            }
                        }}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ));
    }

    return (
        <div>
            <Toaster position="top-center" />
            <Page />
            <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}
>
                <div className="" />
                <div className="relative z-10 w-full max-w-4xl px-4 space-y-8">
                    {!mostrarFormulario && (
                        <div className="bg-white rounded-2xl shadow-2xl p-5 w-full border border-black">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-black">Turmas Cadastradas</h2>
                                <button onClick={criarTurma} className="flex p-4 gap-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-900">
                                    <Plus className="w-5 h-5" /> Nova Turma
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-black">
                                <TabelaTurmas
                                    turmas={turmas}
                                    editarTurma={editarTurma}
                                    confirmarExclusao={confirmarExclusao}
                                />
                            </div>
                        </div>
                    )}

                    {mostrarFormulario && (
                        <div className="bg-black rounded-2xl shadow-2xl p-1 max-w-md mx-auto">
                            <FormularioTurma
                                turmaEmEdicao={turmaEmEdicao}
                                salvarTurma={salvarTurma}
                                cancelarEdicao={cancelarEdicao}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}