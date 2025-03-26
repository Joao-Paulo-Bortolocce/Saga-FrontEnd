import { useState } from 'react';
import { gravarSalas, alterarSalas } from '../services/servicoSalas.js';

export default function FormularioSalas({ atualizarLista, salasEmEdicao, cancelarEdicao, buscarPorCarteiras }) {
  const [salasNum, setSalasNum] = useState(salasEmEdicao?.salasNum || '');
  const [ncarteiras, setNcarteiras] = useState(salasEmEdicao?.ncarteiras || '');
  const [busca, setBusca] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (salasEmEdicao) {
      await alterarSalas(salasEmEdicao.id, { salasNum: Number(salasNum), ncarteiras });
      cancelarEdicao();
    } else {
      await gravarSalas({ salasNum: Number(salasNum), ncarteiras });
    }

    setSalasNum('');
    setNcarteiras('');
    atualizarLista();
  }

  function handleBuscaChange(e) {
    const termo = e.target.value;
    setBusca(termo);
    buscarPorCarteiras(termo);
  }

  return (
    <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
      <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
        <input
          type="number"
          placeholder="Número de carteiras"
          value={serieNum}
          onChange={(e) => setSerieNum(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 w-40"
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