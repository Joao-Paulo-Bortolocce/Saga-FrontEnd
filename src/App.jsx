import { useState, useEffect } from 'react';
import Tela from './components/Tela.jsx';
import FormularioSalas from './componentes/FormularioSalas.jsx';
import TabelaSalas from './componentes/TabelaSalas.jsx';
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
    setSeries(lista ?? []);
  }
  

  return (
    <Tela titulo="Cadastro de Série">
      <FormularioSerie
        atualizarLista={buscarSalas}
        salasEmEdicao={salasEmEdicao}
        cancelarEdicao={cancelarEdicao}
        buscarPorCarteiras={buscarPorCarteiras}
      />
      <TabelaSerie
        salas={salas}
        excluirSalas={excluirSalas}
        editarSalas={editarSalas}
      />
    </Tela>
  );
}