import { useState, useEffect } from 'react';
import FormularioSerie from './cadastros/FormularioSerie.jsx';
import TabelaSerie from './tabelas/TabelaSerie.jsx';
import * as servicoSerie from '../../service/servicoSerie.js';
import { Toaster, toast } from 'react-hot-toast';
import Page from '../layouts/Page.jsx';

export default function HomeSeries() {
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
    toast.promise(
      servicoSerie.excluirSerie(serie).then(buscarSeries),
      {
        loading: 'Excluindo...',
        success: 'Série excluída com sucesso!',
        error: 'Erro ao excluir série',
      }
    );
  }

  function editarSerie(serie) {
    setSerieEmEdicao(serie);
    toast("Você está alterando uma série!", { icon: '⚠️' });
  }


  function cancelarEdicao() {
    setSerieEmEdicao(null);
    toast('Alteração cancelada!', { icon: '❌' });
  }

  async function salvarSerie(serie, modoEdicao) {
    const acao = modoEdicao
      ? servicoSerie.alterarSerie(serie.id, serie)
      : servicoSerie.gravarSerie(serie);

    toast.promise(
      acao.then(() => {
        buscarSeries();
        setSerieEmEdicao(null);
      }),
      {
        loading: modoEdicao ? 'Atualizando...' : 'Cadastrando...',
        success: modoEdicao ? 'Série atualizada com sucesso!' : 'Série cadastrada com sucesso!',
        error: modoEdicao ? 'Erro ao atualizar série' : 'Erro ao cadastrar série',
      }
    );
  }

  async function buscarPorDescricao(termo) {
    const lista = await servicoSerie.consultarSerie(termo);
    setSeries(lista ?? []);
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Page/>
      <FormularioSerie 
        atualizarLista={buscarSeries}
        salvarSerie={salvarSerie}
        serieEmEdicao={serieEmEdicao}
        cancelarEdicao={cancelarEdicao}
        buscarPorDescricao={buscarPorDescricao}
      />
      <TabelaSerie
        series={series}
        excluirSerie={excluirSerie}
        editarSerie={editarSerie}
      />

    </>
  );
}
