import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incluirSalas, atualizarSalas, buscarSalas } from '../../../redux/salaReducer';
import ESTADO from '../../../redux/estados';

export default function CadastroSalas(props) {
  const { salaEmEdicao, setSalaEmEdicao, setExibirTabela } = props;
  const [ncarteiras, setNcarteiras] = useState(salaEmEdicao?.ncarteiras || '');
  const [busca, setBusca] = useState('');
  const { estado, mensagem } = useSelector(state => state.sala);
  const dispatch = useDispatch();

  useEffect(() => {
    if (salaEmEdicao) {
      setNcarteiras(salaEmEdicao.ncarteiras);
    } else {
      setNcarteiras('');
    }
  }, [salaEmEdicao]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (salaEmEdicao) {
      await dispatch(atualizarSalas({ id: salaEmEdicao.id, ncarteiras }));
      setSalaEmEdicao(null);
    } else {
      await dispatch(incluirSalas({ ncarteiras }));
    }
    dispatch(buscarSalas());
    setExibirTabela(true);
    setNcarteiras('');
  }

  function handleBuscaChange(e) {
    const termo = e.target.value;
    setBusca(termo);
    dispatch(buscarSalas(termo));
  }

  function cancelarEdicao() {
    setSalaEmEdicao(null);
    setExibirTabela(true);
    setNcarteiras('');
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
          {salaEmEdicao ? 'Atualizar' : 'Cadastrar'}
        </button>
        {salaEmEdicao && (
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
      {estado === ESTADO.PENDENTE && (
        <div className="text-indigo-600 mt-2">Processando requisição...</div>
      )}
      {estado === ESTADO.ERRO && (
        <div className="text-red-600 mt-2">Erro: {mensagem}</div>
      )}
    </div>
  );
}
