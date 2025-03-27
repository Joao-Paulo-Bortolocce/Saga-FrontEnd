import { useState, useEffect } from 'react';
import { Search } from "lucide-react";

export default function FormularioSerie({
  atualizarLista,
  salvarSerie,
  serieEmEdicao,
  cancelarEdicao,
  buscarPorDescricao,
}) {
  const [serieNum, setSerieNum] = useState('');
  const [descricao, setDescricao] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (serieEmEdicao) {
      setSerieNum(serieEmEdicao.serieNum);
      setDescricao(serieEmEdicao.descricao);
    } else {
      setSerieNum('');
      setDescricao('');
    }
  }, [serieEmEdicao]);

  async function handleSubmit(e) {
    e.preventDefault();
    await salvarSerie(
      { serieNum: Number(serieNum), descricao, id: serieEmEdicao?.id },
      !!serieEmEdicao
    );
    setSerieNum('');
    setDescricao('');
  }

  function handleBuscaChange(e) {
    const termo = e.target.value;
    setBusca(termo);
    buscarPorDescricao(termo);
  }

  return (
    <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
      <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
        <input
          type="number"
          placeholder="Número da Série"
          value={serieNum}
          onChange={(e) => setSerieNum(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 w-40"
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 w-64"
          required
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
          {serieEmEdicao ? 'Atualizar' : 'Cadastrar'}
        </button>
        {serieEmEdicao && (
          <button type="button" onClick={cancelarEdicao} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
            Cancelar
          </button>
        )}
      </form>
      <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-2">
        <Search className="text-green-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por descrição..."
          value={busca}
          onChange={handleBuscaChange}
          className="bg-transparent p-2 focus:outline-none w-64"
        />
      </div>
    </div>
  );
}
