<<<<<<< HEAD
import { useState, useEffect } from 'react';
import logoPrefeitura from '../../../assets/images/logoPrefeitura.png'

export default function FormularioReunioes({
  salvarReuniao,
  reuniaoEmEdicao,
  cancelarEdicao,
}) {
  const [turmaLetra, setTurmaLetra] = useState('');
  const [turmaSerieId, setTurmaSerieId] = useState('');
  const [turmaAnoletivoId, setTurmaAnoletivoId] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    if (reuniaoEmEdicao) {
      setTurmaLetra(reuniaoEmEdicao.turmaLetra);
      setTurmaSerieId(reuniaoEmEdicao.turmaSerieId);
      setTurmaAnoletivoId(reuniaoEmEdicao.turmaAnoletivoId);
      setData(reuniaoEmEdicao.data);
    } else {
      limparCampos();
    }
  }, [reuniaoEmEdicao]);

  function limparCampos() {
    setTurmaLetra('');
    setTurmaSerieId('');
    setTurmaAnoletivoId('');
    setData('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    salvarReuniao(
      {
        id: reuniaoEmEdicao?.id,
        turmaLetra,
        turmaSerieId: Number(turmaSerieId),
        turmaAnoletivoId: Number(turmaAnoletivoId),
        data,
      },
      !!reuniaoEmEdicao
    );
    limparCampos();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center mb-6">
        <img
          src={logoPrefeitura}
          alt="Logo da Prefeitura"
          className="h-24 w-auto"
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-1">Letra da Turma</label>
        <input
          type="text"
          placeholder="Ex: A"
          name='turmaLetra'
          value={turmaLetra}
          onChange={(e) => setTurmaLetra(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-1">Número da Série</label>
        <input
          type="number"
          placeholder="Ex: 1, 2, 3"
          name="turmaSerieId"
          value={turmaSerieId}
          onChange={(e) => setTurmaSerieId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-1">Ano Letivo</label>
        <input
          type="number"
          placeholder="Ex: 2025"
          value={turmaAnoletivoId}
          name="turmaAnoletivoId"
          onChange={(e) => setTurmaAnoletivoId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-1">Data da Reunião</label>
        <input
          type="datetime-local"
          name="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-red-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800 transition-colors text-white py-2 px-4 rounded-lg"
      >
        {reuniaoEmEdicao ? 'Alterar' : 'Confirmar'}
      </button>
      <button
        type="button"
        onClick={cancelarEdicao}
        className="w-full mt-2 bg-red-500 hover:bg-red-800 text-white py-2 px-4 rounded-lg"
      >
        Cancelar
      </button>
    </form>
  );
}
=======
import { useEffect, useState } from "react";

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
    fetch("http://localhost:8080/reuniao/turmas")
      .then(res => res.json())
      .then(data => setTurmas(data.turmas || [])) 
      .catch(err => console.error("Erro ao buscar turmas:", err));

    fetch("http://localhost:8080/serie/buscarTodos")
      .then(res => res.json())
      .then(data => setSeries(data.series));

    fetch("http://localhost:8080/anoletivo/buscarTodos")
      .then(res => res.json())
      .then(data => setAnos(data.anos));
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
      className="bg-[#0e1629] text-white max-w-md mx-auto p-8 rounded-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        salvarReuniao(form, !!reuniaoEmEdicao?.reuniaoId);
      }}
    >
      <h1 className="text-2xl text-center font-bold mb-4">Agendar Reunião</h1>

      {/* SÉRIE */}
      <label className="block text-sm">Série</label>
      <select
        className="w-full p-2 rounded text-black"
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

      {/* ANO LETIVO */}
      <label className="block text-sm">Ano Letivo</label>
      <select
        className="w-full p-2 rounded text-black"
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

      {/* LETRA DA TURMA */}
      <label className="block text-sm">Letra da Turma</label>
      <select
        className="w-full p-2 rounded text-black"
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

      {/* TIPO DA REUNIÃO */}
      <label className="block text-sm">Tipo da Reunião</label>
      <input
        className="w-full p-2 rounded text-black"
        type="text"
        placeholder="Ex: Professores, Pais, Coordenação..."
        value={form.tipo || ""}
        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
      />

      {/* DATA E HORA */}
      <label className="block text-sm">Data e Hora</label>
      <input
        className="w-full p-2 rounded text-black"
        type="datetime-local"
        value={form.data || ""}
        onChange={(e) => setForm({ ...form, data: e.target.value })}
      />

      {/* BOTÕES */}
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
>>>>>>> d610ece26dad0d670db19b79d565805dcfa9dd04
