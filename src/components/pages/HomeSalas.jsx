import { useState, useEffect } from 'react';
import Telas from './componentes/Telas.js';
import FormularioSalas from './componentes/FormularioSalas.js';
import TabelaSalas from './componentes/pages/tabelas/TabelaSalas.js';
import * as servicoSalas from './services/servicoSalas.js'

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
    <Telas titulo="Cadastro de Série">
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
    </Telas>
  );
}