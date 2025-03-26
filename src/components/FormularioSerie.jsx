import { useState } from 'react';
import { gravarSerie, alterarSerie } from '../services/servicoSerie.js';

export default function FormularioSerie({ atualizarLista, serieEmEdicao, cancelarEdicao, buscarPorDescricao }) {
  const [serieNum, setSerieNum] = useState(serieEmEdicao?.serieNum || '');
  const [descricao, setDescricao] = useState(serieEmEdicao?.descricao || '');
  const [busca, setBusca] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (serieEmEdicao) {
      await alterarSerie(serieEmEdicao.id, { serieNum: Number(serieNum), descricao });
      cancelarEdicao();
    } else {
      await gravarSerie({ serieNum: Number(serieNum), descricao });
    }

    setSerieNum('');
    setDescricao('');
    atualizarLista();
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
        <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          {serieEmEdicao ? 'Atualizar' : 'Cadastrar'}
        </button>
        {serieEmEdicao && (
          <button type="button" onClick={cancelarEdicao} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded">
            Cancelar
          </button>
        )}
      </form>

      {/* Campo de busca por descrição */}
      <input
        type="text"
        placeholder="Buscar por descrição..."
        value={busca}
        onChange={handleBuscaChange}
        className="p-2 rounded bg-gray-800 border border-gray-700 w-72"
      />
    </div>
  );
}
