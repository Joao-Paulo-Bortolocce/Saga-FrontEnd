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