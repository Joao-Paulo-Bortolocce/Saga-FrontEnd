import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, Search, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { apagarMatricula, buscarMatriculasFiltros } from '../../../redux/matriculaReducer';
import ESTADO from '../../../redux/estados';
import { listaDeanosLetivos } from '../../../mockDados/mockAnoLetivo.js';
import { listaDeSeries } from '../../../mockDados/mockSeries.js';

export default function TabelaMatricula(props) {
  const { estado, mensagem, listaDeMatriculas } = useSelector(state => state.matricula);
  const dispatch = useDispatch();
  const [pesquisa, setPesquisa] = useState("");
  const [filtros, setFiltros] = useState({
    anoLetivo: 0,
    serie: 0
  });


  useEffect(() => {
    dispatch(buscarMatriculasFiltros(filtros));
  }, []);

  useEffect(() => {
    dispatch(buscarMatriculasFiltros(filtros));
  }, [filtros]);

  function nomeSerie(id) {
    const serie = listaDeSeries.filter((aux) => {
      return aux.serie_id == id;
    })

    return serie[0].serie_descr
  }

  function nomeAno(id) {
    const ano = listaDeanosLetivos.filter((aux) => {
      return aux.anoletivo_id == id;
    })

    return ano[0].anoletivo_inicio.substring(0, 4);
  }

  function addFiltro(event) {
    const id = event.currentTarget.id;
    let valor = event.currentTarget.value;
    setFiltros({ ...filtros, [id]: valor });

  }

  function excluirMatricula(matricula) {
    if (window.confirm(`Deseja realmente excluir a matrícula de ${matricula.aluno.pessoa.nome} no ${matricula.serie.serieDescr} em ${matricula.anoLetivo.inicio.substring(0, 4)}?`)) {
      dispatch(apagarMatricula(matricula));
    }
  }

  const matriculasFiltradas = listaDeMatriculas.filter(matricula =>
    matricula.aluno.pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  if (estado === ESTADO.PENDENTE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">{mensagem}</div>
      </div>
    );
  }

  if (estado === ESTADO.ERRO) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <AlertCircle className="w-5 h-5 mr-2" />
          {mensagem}
        </div>
        <button
          onClick={() => dispatch(buscarMatriculas())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 px-6 sm:px-10 lg:px-16-50 min-h-screen font-sans text-black">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Cadastro de Matrículas</h1>
            <p className="mt-1 text-sm text-gray-600">Visualize e gerencie as matrículas cadastradas.</p>
          </div>
          <button
            onClick={() => props.setExibirTabela(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl shadow-md hover:bg-indigo-700 transition-all text-sm font-medium"
          >
            <UserPlus className="h-5 w-5" /> Nova Matrícula
          </button>
        </div>

        {/* Barra de pesquisa */}
        <div className="relative max-w-lg mx-auto sm:mx-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <label htmlFor="anoLetivo" className="block text-sm font-medium text-gray-700 mb-2">
              Ano Letivo
            </label>
            <select
              id="anoLetivo"
              value={filtros.anoLetivo}
              onChange={addFiltro}
              className="w-full rounded-lg border border-gray-300 p-2.5 bg-white text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value={0}>Todos</option>
              {listaDeanosLetivos.map((ano) => (
                <option key={ano.anoletivo_id} value={ano.anoletivo_id}>
                  {ano.anoletivo_inicio.substring(0, 4)}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <label htmlFor="serie" className="block text-sm font-medium text-gray-700 mb-2">
              Série
            </label>
            <select
              id="serie"
              value={filtros.serie}
              onChange={addFiltro}
              className="w-full rounded-lg border border-gray-300 p-2.5 bg-white text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value={0}>Todas</option>
              {listaDeSeries.map((serie) => (
                <option key={serie.serie_id} value={serie.serie_id}>
                  {serie.serie_descr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {listaDeMatriculas.length > 0 ?
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">RA</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Nome</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Ano Letivo</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Série</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Turma</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {matriculasFiltradas.map((matricula) => (
                  <tr key={matricula.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{matricula.aluno.ra}</td>
                    <td className="px-6 py-4">{matricula.aluno.pessoa.nome}</td>
                    <td className="px-6 py-4">{matricula.anoLetivo.inicio.substring(0, 4)}</td>
                    <td className="px-6 py-4">{matricula.serie.serieDescr}</td>
                    <td className="px-6 py-4">{matricula.turma ? matricula.turma.letra : 'Indefinido'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => excluirMatricula(matricula)}
                        className="text-red-500 hover:text-red-700 transition-all"
                        title="Excluir matrícula"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          : (
            <p className="text-xl sm:text-2xl text-center text-white bg-gray-600 rounded-xl p-6 shadow-md">
              Nenhuma matrícula foi encontrada
              {filtros.serie != 0 && ` na série ${nomeSerie(filtros.serie)}`}
              {filtros.anoLetivo != 0 && ` no ano letivo de ${nomeAno(filtros.anoLetivo)}`}
              .
            </p>

          )
        }
      </div>
    </div>

  );
}
