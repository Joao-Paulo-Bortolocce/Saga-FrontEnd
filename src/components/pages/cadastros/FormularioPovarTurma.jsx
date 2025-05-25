import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FormularioPovoarTurma({ turmaSelecionada, cancelar }) {
    const [alunos, setAlunos] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [data, setData] = useState("");
    const [matriculas, setMatriculas] = useState([]);

    useEffect(() => {
        if (turmaSelecionada) {
            // Buscar alunos sem matrícula
            fetch(`http://localhost:8080/aluno/buscarTodosSemMatricula?anoLetivo=${turmaSelecionada.anoLetivo.id}`)
                .then(res => res.json())
                .then(dados => {
                    console.log("🟢 Alunos sem matrícula:", dados);
                    if (dados.status) setAlunos(dados.listaDeAlunos);
                    else toast.error(dados.mensagem);
                });

            // Buscar todas as matrículas para encontrar o ID de cada RA
            fetch(`http://localhost:8080/matricula`)
                .then(res => res.json())
                .then(dados => {
                    console.log("🟢 Matriculas carregadas:", dados);  // <- aqui
                    if (dados.status) setMatriculas(dados.listaDeMatriculas);
                    else toast.error("Erro ao carregar matrículas");
                });
        }
    }, [turmaSelecionada]);

    function toggleSelecionado(ra) {
        setSelecionados(prev =>
            prev.includes(ra) ? prev.filter(id => id !== ra) : [...prev, ra]
        );
    }

    async function gravarMatriculas(e) {
        e.preventDefault();
        if (!data) return toast.error("Selecione uma data para a matrícula");
        if (selecionados.length === 0) return toast.error("Selecione pelo menos um aluno");

        const promises = selecionados.map(ra => {
            const matricula = matriculas.find(m =>
                m.aluno?.ra == ra &&
                m.anoLetivo?.id == turmaSelecionada.anoLetivo.id &&
                m.serie?.serieId == turmaSelecionada.serie.serieId
            );

            if (!matricula) {
                toast.error(`Matrícula não encontrada para RA ${ra}`);
                return Promise.resolve({ status: false, ra, mensagem: "Matrícula não localizada." });
            }

            return fetch("http://localhost:8080/matricula", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: matricula.id,
                    ra,
                    anoLetivo_id: turmaSelecionada.anoLetivo.id.toString(),
                    serie_id: turmaSelecionada.serie.serieId.toString(),
                    turma_letra: turmaSelecionada.letra,
                    data,
                    valido: true,
                    aprovado: false
                })
            })
                .then(res => res.json())
                .then(resp => ({ ra, ...resp }));
        });

        toast.promise(
            Promise.all(promises).then(results => {
                const erros = results.filter(r => !r.status);
                if (erros.length > 0) {
                    erros.forEach(e =>
                        toast.error(`Erro RA ${e.ra}: ${e.mensagem}`)
                    );
                    return;
                }

                toast.success("Turma povoada com sucesso!");
                cancelar();
            }),
            {
                loading: "Atualizando matrículas...",
                success: "Atualização concluída",
                error: "Erro durante atualização"
            }
        );
    }

    return (
        <form onSubmit={gravarMatriculas} className="bg-gray-800 text-white p-6 rounded-xl space-y-4 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold">Povoar Turma {turmaSelecionada.letra}</h2>
            <p><strong>Ano Letivo:</strong> {turmaSelecionada.anoLetivo.inicio.slice(0, 10)}</p>
            <p><strong>Série:</strong> {turmaSelecionada.serie.serieNum} - {turmaSelecionada.serie.serieDescr}</p>

            <label className="block">Data da Matrícula:</label>
            <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full rounded text-black p-2"
            />

            <div className="space-y-2 max-h-64 overflow-y-auto border p-3 rounded">
                {alunos.map(aluno => (
                    <div key={aluno.ra} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selecionados.includes(aluno.ra)}
                            onChange={() => toggleSelecionado(aluno.ra)}
                        />
                        <label>{aluno.pessoa.nome} (RA: {aluno.ra})</label>
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <button type="submit" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                    Confirmar Atualização
                </button>
                <button type="button" onClick={cancelar} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                    Cancelar
                </button>
            </div>
        </form>
    );
}
