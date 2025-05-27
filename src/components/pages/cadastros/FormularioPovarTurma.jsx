import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FormularioPovoarTurma({ turmaSelecionada, cancelar }) {
    const [matriculas, setMatriculas] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [data, setData] = useState("");

    useEffect(() => {
        if (!turmaSelecionada) return;

        const serieId = turmaSelecionada.serie?.serieId;
        const anoLetivoId = turmaSelecionada.anoLetivo?.id;

        fetch(`http://localhost:8080/matricula/buscarSemTurma?serie=${serieId}&anoLetivo=${anoLetivoId}`)
            .then(res => res.json())
            .then(dados => {
                if (dados.status) {
                    setMatriculas(dados.listaDeMatriculas);
                } else {
                    toast.error(dados.mensagem || "Erro ao buscar alunos");
                }
            })
            .catch(() => toast.error("Erro ao conectar com o servidor"));
    }, [turmaSelecionada]);

    function toggleSelecionado(ra) {
        setSelecionados(prev =>
            prev.includes(ra) ? prev.filter(id => id !== ra) : [...prev, ra]
        );
    }

    async function gravarMatriculas(e) {
        e.preventDefault();
        if (!data) return toast.error("Informe a data da matrícula");
        if (selecionados.length === 0) return toast.error("Selecione ao menos um aluno");

        const promises = selecionados.map(ra => {
            const matricula = matriculas.find(m => m.aluno?.ra === ra);
            const corpo = {
                id: matricula.id,
                data,
                aprovado: false,
                valido: true,
                turma_letra: turmaSelecionada.letra,
                serie: turmaSelecionada.serie,
                anoLetivo: turmaSelecionada.anoLetivo,
                aluno: matricula.aluno
            };

            return fetch("http://localhost:8080/matricula", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo)
            }).then(res => res.json());
        });

        toast.promise(
            Promise.all(promises).then(() => {
                toast.success("Turma povoada com sucesso!");
                cancelar(); // fecha e recarrega tela anterior
            }),
            {
                loading: "Gravando alunos...",
                success: "Finalizado!",
                error: "Erro durante gravação"
            }
        );
    }

    return (
        <form onSubmit={gravarMatriculas} className="bg-gray-800 text-white p-6 rounded-xl space-y-4 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold">Povoar Turma {turmaSelecionada.letra}</h2>
            <p><strong>Ano Letivo:</strong> {turmaSelecionada.anoLetivo.inicio.slice(0, 10)}</p>
            <p><strong>Série:</strong> {turmaSelecionada.serie.serieNum} - {turmaSelecionada.serie.serieDescr}</p>

            <label>Data da Matrícula:</label>
            <input
                type="date"
                value={data}
                onChange={e => setData(e.target.value)}
                className="w-full text-black p-2 rounded"
                required
            />

            <div className="space-y-2 max-h-64 overflow-y-auto border p-3 rounded bg-gray-700">
                {matriculas.length === 0 && (
                    <p className="text-gray-300">Nenhum aluno disponível para esta turma.</p>
                )}
                {matriculas.map(matricula => (
                    <div key={matricula.aluno.ra} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selecionados.includes(matricula.aluno.ra)}
                            onChange={() => toggleSelecionado(matricula.aluno.ra)}
                        />
                        <label>
                            {matricula.aluno.pessoa?.nome || "[Sem nome]"} (RA: {matricula.aluno.ra})
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <button type="submit" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Confirmar Atualização</button>
                <button type="button" onClick={cancelar} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Cancelar</button>
            </div>
        </form>
    );
}
