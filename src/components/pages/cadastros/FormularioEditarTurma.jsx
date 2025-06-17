import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FormularioEditarTurma({ turmaSelecionada, cancelar }) {
    const [matriculas, setMatriculas] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [data, setData] = useState("");

    useEffect(() => {
        if (!turmaSelecionada) return;

        const serieId = turmaSelecionada.serie?.serieId;
        const anoLetivoId = turmaSelecionada.anoLetivo?.id;
        const letra = turmaSelecionada.letra;

        fetch(`http://localhost:8080/matricula/buscarTodasFiltradas?serie=${serieId}&anoLetivo=${anoLetivoId}&valido=1&turmaLetra=${letra}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar alunos");
                return res.json();
            })
            .then(dados => {
                if (dados.status) {
                    const lista = dados.listaDeMatriculas.filter(m =>
                        m.turma?.letra?.toUpperCase() === letra.toUpperCase()
                    );
                    setMatriculas(lista);
                    setSelecionados(lista.map(m => m.aluno.ra));
                } else {
                    toast.error(dados.mensagem || "Erro ao buscar alunos");
                }
            })
            .catch(() => toast.error("Erro de conexão"));
    }, [turmaSelecionada]);

    function toggleSelecionado(ra) {
        setSelecionados(prev =>
            prev.includes(ra) ? prev.filter(id => id !== ra) : [...prev, ra]
        );
    }

    async function salvarEdicao(e) {
        e.preventDefault();
        if (!data) return toast.error("Informe a data");

        const promises = matriculas.map(m => {
            const selecionado = selecionados.includes(m.aluno.ra);
            if (selecionado) {
                const corpo = {
                    id: m.id,
                    data,
                    aprovado: false,
                    valido: true,
                    turma_letra: turmaSelecionada.letra,
                    serie: turmaSelecionada.serie,
                    anoLetivo: turmaSelecionada.anoLetivo,
                    aluno: m.aluno
                };

                return fetch("http://localhost:8080/matricula", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem('token')
                    },
                    body: JSON.stringify(corpo)
                }).then(res => {
                    if (!res.ok) throw new Error("Erro ao atualizar matrícula");
                    return res.json();
                });
            } else {
                return fetch(`http://localhost:8080/matricula/removerTurma/${m.id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }).then(res => {
                    if (!res.ok) throw new Error("Erro ao remover matrícula");
                    return res.json();
                });
            }
        });

        toast.promise(
            Promise.all(promises).then(() => {
                toast.success("Edição concluída");
                cancelar();
            }),
            {
                loading: "Salvando alterações...",
                success: "Finalizado!",
                error: "Erro ao salvar"
            }
        );
    }

    return (
        <form onSubmit={salvarEdicao} className="bg-white text-black p-6 rounded-xl space-y-4 max-w-xl mx-auto border border-gray-300 shadow-xl">
            <h2 className="text-2xl font-bold">Editar Turma {turmaSelecionada.letra}</h2>
            <p><strong>Ano Letivo:</strong> {turmaSelecionada.anoLetivo.inicio.slice(0, 10)}</p>
            <p><strong>Série:</strong> {turmaSelecionada.serie.serieNum} - {turmaSelecionada.serie.serieDescr}</p>

            <label>Data da Matrícula:</label>
            <input
                type="date"
                value={data}
                onChange={e => setData(e.target.value)}
                className="w-full text-black p-2 rounded border border-gray-300"
                required
            />

            <div className="space-y-2 max-h-64 overflow-y-auto border p-3 rounded bg-gray-100">
                {matriculas.length === 0 && (
                    <p className="text-gray-500">Nenhum aluno encontrado nesta turma.</p>
                )}
                {matriculas.map(m => (
                    <div key={m.aluno.ra} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selecionados.includes(m.aluno.ra)}
                            onChange={() => toggleSelecionado(m.aluno.ra)}
                        />
                        <label>
                            {m.aluno.pessoa?.nome} (RA: {m.aluno.ra})
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <button type="submit" className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600 text-white">
                    Salvar Edição
                </button>
                <button type="button" onClick={cancelar} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white">
                    Cancelar
                </button>
            </div>
        </form>
    );
}
