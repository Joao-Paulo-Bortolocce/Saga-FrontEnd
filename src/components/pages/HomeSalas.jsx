import { useState, useEffect } from 'react';
import Page from '../layouts/Page.jsx';
import FormularioSalas from './cadastros/CadastroSalas.jsx';
import TabelaSalas from './tabelas/TabelaSalas.jsx';
import * as servicoSalas from '../../service/servicoSalas.js'

export default function App() {
  const [salas, setSalas] = useState([]);
  const [salasEmEdicao, setSalasEmEdicao] = useState(null);

  useEffect(() => {
    buscarSalas();
  }, []);

  async function buscarSalas() {
    const lista = await servicoSalas.consultarSalas();
    setSalas(lista ?? []);
  }

  async function excluirSalas(salas) {
    await servicoSalas.excluirSalas(salas);
    buscarSalas();
  }

  function editarSalas(salas) {
    setSalasEmEdicao(salas);
  }

  function cancelarEdicao() {
    setSalasEmEdicao(null);
  }

  async function buscarPorCarteiras(termo) {
    const lista = await servicoSalas.consultarSalas(termo);
    setSalas(lista ?? []);
  }
  

  return (
      <div>
        <Page/>
        <FormularioSalas
          atualizarLista={buscarSalas}
          salasEmEdicao={salasEmEdicao}
          cancelarEdicao={cancelarEdicao}
          buscarPorCarteiras={buscarPorCarteiras}
        />
        <TabelaSalas
          salas={salas}
          excluirSalas={excluirSalas}
          editarSalas={editarSalas}
        />
      </div>

  );
}