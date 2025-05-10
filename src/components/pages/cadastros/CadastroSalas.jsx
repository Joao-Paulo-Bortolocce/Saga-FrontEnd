import { useState } from 'react';
import { gravarSalas, alterarSalas } from '../../../service/servicoSalas';

export default function FormularioSalas({ atualizarLista, salasEmEdicao, cancelarEdicao, buscarPorCarteiras }) {
  const [ncarteiras, setNcarteiras] = useState(salasEmEdicao?.ncarteiras || '');
  const [busca, setBusca] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (salasEmEdicao) {
      await alterarSalas(salasEmEdicao.id, { ncarteiras });
      cancelarEdicao();
    } else {
      await gravarSalas({ ncarteiras });
    }

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
          placeholder="Numero de Carteiras"
          value={ncarteiras}
          onChange={(e) => setNcarteiras(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 w-64"
          required
        />
        <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          {salasEmEdicao ? 'Atualizar' : 'Cadastrar'}
        </button>
        {salasEmEdicao && (
          <button type="button" onClick={cancelarEdicao} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded">
            Cancelar
          </button>
        )}
      </form>
      <input
        type="text"
        placeholder="Buscar por numero de carteiras"
        value={busca}
        onChange={handleBuscaChange}
        className="p-2 rounded bg-gray-800 border border-gray-700 w-72"
      />
    </div>
  );
}