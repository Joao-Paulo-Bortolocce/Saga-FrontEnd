import { useState, useEffect } from 'react';
import Tela from './components/Tela.jsx';
import FormularioSerie from './components/FormularioSerie.jsx';
import TabelaSerie from './components/TabelaSerie.jsx';
import * as servicoSerie from './services/servicoSerie.js';

export default function App() {
  const [series, setSeries] = useState([]);
  const [serieEmEdicao, setSerieEmEdicao] = useState(null);

  useEffect(() => {
    buscarSeries();
  }, []);

  async function buscarSeries() {
    const lista = await servicoSerie.consultarSerie();
    setSeries(lista ?? []);
  }

  async function excluirSerie(serie) {
    await servicoSerie.excluirSerie(serie);
    buscarSeries();
  }

  function editarSerie(serie) {
    setSerieEmEdicao(serie);
  }

  function cancelarEdicao() {
    setSerieEmEdicao(null);
  }

  async function buscarPorDescricao(termo) {
    const lista = await servicoSerie.consultarSerie(termo);
    setSeries(lista ?? []);
  }
  

  return (
    <Tela titulo="Cadastro de Série">
      <FormularioSerie
        atualizarLista={buscarSeries}
        serieEmEdicao={serieEmEdicao}
        cancelarEdicao={cancelarEdicao}
        buscarPorDescricao={buscarPorDescricao}
      />
      <TabelaSerie
        series={series}
        excluirSerie={excluirSerie}
        editarSerie={editarSerie}
      />
    </Tela>
  );
}
