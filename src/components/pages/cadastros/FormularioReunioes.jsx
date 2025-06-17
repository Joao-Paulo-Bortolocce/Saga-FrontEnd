import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FormularioReunioes({ reuniaoEmEdicao, salvarReuniao, cancelarEdicao }) {
  const [form, setForm] = useState(reuniaoEmEdicao || {});
  const [turmas, setTurmas] = useState([]);
  const [letrasFiltradas, setLetrasFiltradas] = useState([]);
  const [series, setSeries] = useState([]);
  const [anos, setAnos] = useState([]);

  useEffect(() => {
    if (reuniaoEmEdicao) {
      setForm({
        ...reuniaoEmEdicao,
        serie_id: reuniaoEmEdicao.serie?.serieId,
        anoletivo_id: reuniaoEmEdicao.anoLetivo?.id,
        letra: reuniaoEmEdicao.turma?.letra || reuniaoEmEdicao.letra,
        tipo: reuniaoEmEdicao.reuniaoTipo,
        data: reuniaoEmEdicao.reuniaoData?.slice(0, 16) // datetime-local precisa desse formato
      });
    } else {
      setForm({});
    }
  }, [reuniaoEmEdicao]);

  useEffect(() => {
    fetch("http://localhost:8080/turma/buscarTodos", { headers: { Authorization: localStorage.getItem('token') } })
      .then(res => res.json())
      .then(data => setTurmas(data.turmas ?? [])) // <- garante array
      .catch(err => console.error("Erro ao buscar turmas:", err));

    fetch("http://localhost:8080/serie/buscarTodos", { headers: { Authorization: localStorage.getItem('token') } })
      .then(res => res.json())
      .then(data => setSeries(data.series ?? [])) // <- garante array
      .catch(err => console.error("Erro ao buscar séries:", err));

    fetch("http://localhost:8080/anoletivo", { headers: { Authorization: localStorage.getItem('token') } })
      .then(res => res.json())
      .then(data => setAnos(data.anoletivo ?? [])) // <- garante array
      .catch(err => console.error("Erro ao buscar ano letivo:", err));
  }, []);

  useEffect(() => {
    if (form.serie_id && form.anoletivo_id) {
      const filtradas = turmas
        .filter(t =>
          t.serie.serieId === parseInt(form.serie_id) &&
          t.anoLetivo.id === parseInt(form.anoletivo_id)
        )
        .map(t => t.letra);
      setLetrasFiltradas(filtradas);
    } else {
      setLetrasFiltradas([]);
    }
  }, [form.serie_id, form.anoletivo_id, turmas]);

  return (
    <form
      className="bg-white text-black max-w-md mx-auto p-8 rounded-xl border border-gray-300 shadow-md space-y-4"
      onSubmit={(e) => {
        e.preventDefault();

        const dataHoje = new Date();
        const dataSelecionada = new Date(form.data);

        if (dataSelecionada < dataHoje) {
          toast.error('Você está selecionando uma data anterior à atual!');
        } else {
          salvarReuniao(form, !!reuniaoEmEdicao?.reuniaoId);
        }
      }}
    >
      <h1 className="text-2xl text-center font-bold mb-4">Agendar Reunião</h1>

      {/* Série */}
      <label className="block text-sm font-medium">Série</label>
      <select
        className="w-full p-2 rounded border border-gray-300 bg-white"
        value={form.serie_id || ""}
        onChange={(e) => setForm({ ...form, serie_id: e.target.value })}
      >
        <option value="">Selecione...</option>
        {series.map((s) => (
          <option key={s.serieId} value={s.serieId}>
            {s.serieNum} - {s.serieDescr}
          </option>
        ))}
      </select>

      {/* Ano Letivo */}
      <label className="block text-sm font-medium">Ano Letivo</label>
      <select
        className="w-full p-2 rounded border border-gray-300 bg-white"
        value={form.anoletivo_id || ""}
        onChange={(e) => setForm({ ...form, anoletivo_id: e.target.value })}
      >
        <option value="">Selecione...</option>
        {anos.map((a) => (
          <option key={a.id} value={a.id}>
            {new Date(a.inicio).getFullYear()}
          </option>
        ))}
      </select>

      {/* Letra */}
      <label className="block text-sm font-medium">Letra da Turma</label>
      <select
        className="w-full p-2 rounded border border-gray-300 bg-white"
        value={form.letra || ""}
        onChange={(e) => setForm({ ...form, letra: e.target.value })}
      >
        <option value="">Selecione...</option>
        {letrasFiltradas.map((letra, index) => (
          <option key={index} value={letra}>
            {letra}
          </option>
        ))}
      </select>

      {/* Tipo */}
      <label className="block text-sm font-medium">Tipo da Reunião</label>
      <input
        type="text"
        placeholder="Ex: Professores, Pais, Coordenação..."
        className="w-full p-2 rounded border border-gray-300"
        value={form.tipo || ""}
        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
      />

      {/* Data */}
      <label className="block text-sm font-medium">Data e Hora</label>
      <input
        type="datetime-local"
        className="w-full p-2 rounded border border-gray-300"
        value={form.data || ""}
        onChange={(e) => setForm({ ...form, data: e.target.value })}
      />

      {/* Botões */}
      <div className="flex justify-between pt-4">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Confirmar
        </button>
        <button
          type="button"
          onClick={cancelarEdicao}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
