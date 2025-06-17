import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    buscarAnosLetivos,
    buscarSeries,
    buscarProfissionais,
    buscarSalas
} from "../../../service/turmaService.js";

export default function FormularioTurma({ turmaEmEdicao, salvarTurma, cancelarEdicao }) {
    const [form, setForm] = useState(turmaEmEdicao || {});
    const [anos, setAnos] = useState([]);
    const [series, setSeries] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [salas, setSalas] = useState([]);

    useEffect(() => {
        setForm(turmaEmEdicao || {});
    }, [turmaEmEdicao]);

    useEffect(() => {
        async function carregarDados() {
            const dados = await Promise.all([
                buscarSeries(),
                buscarAnosLetivos(),
                buscarProfissionais(),
                buscarSalas()
            ]);

            setSeries(dados[0].series || []);
            setAnos(dados[1].anoletivo || []);
            setProfissionais(dados[2].listaDeProfissionais || []);
            setSalas(dados[3].salas || []);
            console.log(dados);
        }

        carregarDados();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        if (!form.turmaLetra || !form.serie_id || !form.anoletivo_id || !form.profissional_rn || !form.sala_id) {
            toast.error("Preencha todos os campos!");
            return;
        }

        salvarTurma(form, !!form.letraAtual);
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#0e1629] text-white max-w-md mx-auto p-8 rounded-xl space-y-4">
            <h1 className="text-2xl text-center font-bold mb-4">
                {form.letraAtual ? "Editar Turma" : "Nova Turma"}
            </h1>

            {/* Letra */}
            <label className="block text-sm">Letra da Turma</label>
            <input
                type="text"
                maxLength="1"
                className="w-full p-2 rounded text-black uppercase"
                value={form.turmaLetra || ""}
                onChange={(e) => setForm({ ...form, turmaLetra: e.target.value.toUpperCase(), novaLetra: e.target.value.toUpperCase() })}
            />

            {/* Série */}
            <label className="block text-sm">Série</label>
            <select
                className="w-full p-2 rounded text-black"
                value={form.serie_id || ""}
                onChange={(e) => setForm({ ...form, serie_id: parseInt(e.target.value) })}
            >
                <option value="">Selecione...</option>
                {series.map((serie) => (
                    <option key={serie.serieId} value={serie.serieId}>
                        {serie.serieNum} - {serie.serieDescr}
                    </option>
                ))}
            </select>

            {/* Ano Letivo */}
            <label className="block text-sm">Ano Letivo</label>
            <select
                className="w-full p-2 rounded text-black"
                value={form.anoletivo_id || ""}
                onChange={(e) => setForm({ ...form, anoletivo_id: parseInt(e.target.value) })}
            >
                <option value="">Selecione...</option>
                {anos.map((ano) => (
                    <option key={ano.id} value={ano.id}>
                        {new Date(ano.inicio).getFullYear()}
                    </option>
                ))}
            </select>

            {/* Profissional */}
            <label className="block text-sm">Profissional</label>
            <select
                className="w-full p-2 rounded text-black"
                value={form.profissional_rn || ""}
                onChange={(e) => setForm({ ...form, profissional_rn: parseInt(e.target.value) })}
            >
                <option value="">Selecione...</option>
                {profissionais.map((p) => (
                    <option key={p.profissional_rn} value={p.profissional_rn}>
                        {p.profissional_usuario} (RN: {p.profissional_rn})
                    </option>
                ))}
            </select>

            {/* Sala */}
            <label className="block text-sm">Sala</label>
            <select
                className="w-full p-2 rounded text-black"
                value={form.sala_id || ""}
                onChange={(e) => setForm({ ...form, sala_id: parseInt(e.target.value) })}
            >
                <option value="">Selecione...</option>
                {salas.map((sala) => (
                    <option key={sala.id} value={sala.id}>
                        {sala.descricao}
                    </option>
                ))}
            </select>

            {/* Botões */}
            <div className="flex justify-between mt-4">
                <button type="submit" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                    Confirmar
                </button>
                <button type="button" onClick={cancelarEdicao} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                    Cancelar
                </button>
            </div>
        </form>
    );
}