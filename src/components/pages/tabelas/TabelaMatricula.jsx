import React, { useEffect, useState } from 'react';
import { Ban, Trash2, Search, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { apagarMatricula, buscarMatriculasFiltros, atualizarMatricula } from '../../../redux/matriculaReducer';
import ESTADO from '../../../redux/estados';
import { listaDeanosLetivos } from '../../../mockDados/mockAnoLetivo.js';
import { listaDeSeries } from '../../../mockDados/mockSeries.js';
import toast, { Toaster } from "react-hot-toast";

export default function TabelaMatricula(props) {
  const { estado, mensagem, listaDeMatriculas } = useSelector(state => state.matricula);
  const dispatch = useDispatch();
  const [pesquisa, setPesquisa] = useState("");
  const[toastMostrado,setToastMostrado]=useState(false);
  const [filtros, setFiltros] = useState({
    anoLetivo: 0,
    serie: 0,
    valido: 0
  });

  useEffect(() => {
    dispatch(buscarMatriculasFiltros(filtros));
  }, [dispatch,filtros]);

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
    let id = event.currentTarget.id;
    if (id.startsWith("valido")) {
      id = "valido";
    }
    let valor = event.currentTarget.value;
    setFiltros({ ...filtros, [id]: valor });
  }

  function excluirMatricula(matricula) {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5`}
      >
        <div className="p-4">
          <p className="text-sm font-medium text-gray-900 mb-2">
            Confirmar exclusão
          </p>
          <p className="text-sm text-gray-700">
            Deseja realmente excluir a matrícula de <strong>{matricula.aluno.pessoa.nome}</strong> no <strong>{matricula.serie.serieDescr}</strong> em <strong>{matricula.anoLetivo.inicio.substring(0, 4)}</strong>?
          </p>
        </div>
        <div className="flex justify-end border-t border-gray-200">
          <button
            onClick={() => {
              dispatch(apagarMatricula(matricula));
              toast.dismiss(t.id);
            }}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-bl-lg"
          >
            Confirmar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Cancelar
          </button>
        </div>
      </div>
    ));
  }
  

  function cancelarMatricula(matricula) {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-red-600 ring-opacity-40 border border-red-300`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-red-700">
                Cancelamento permanente
              </p>
              <p className="mt-1 text-sm text-gray-800">
                Tem certeza que deseja <strong>cancelar definitivamente</strong> a matrícula de <strong>{matricula.aluno.pessoa.nome}</strong> no <strong>{matricula.serie.serieDescr}</strong> ({matricula.anoLetivo.inicio.substring(0, 4)})?
              </p>
              <p className="mt-2 text-sm text-red-600 font-medium">
                Esta ação é irreversível. A matrícula será desativada e não poderá ser recuperada!
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={() => {
              const matriculaAtualizada = { ...matricula, valido: false };
              dispatch(atualizarMatricula(matriculaAtualizada));
              toast.dismiss(t.id);
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-bl-lg"
          >
            Cancelar matrícula
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Voltar
          </button>
        </div>
      </div>
    ));
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
    if (!toastMostrado) {
      setToastMostrado(true);
      setTimeout(() => {
        toast.error(mensagem, { duration: 7000, repeat: false });
      }, 1000);
      setTimeout(() => {
        setToastMostrado(false);
      }, 15000);
    }
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <AlertCircle className="w-5 h-5 mr-2" />
          {mensagem}
        </div>
        <button
          onClick={() => dispatch(buscarMatriculasFiltros())}
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
          <div className="bg-white p-4 rounded-xl shadow-sm  max-h-fit flex flex-col justify-center">
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

          <div className="bg-white p-4 rounded-xl shadow-sm  max-h-fit flex flex-col justify-center">
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

          <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col justify-center">
            <label htmlFor="valido" className="block text-sm font-semibold text-gray-800 mb-4">
              Validade
            </label>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <input
                  id="valido-0"
                  name="valido"
                  type="radio"
                  value={0}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  onChange={addFiltro}
                  checked={filtros.valido == 0}
                />
                <span className="text-sm text-gray-700">Todas</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <input
                  id="valido-1"
                  name="valido"
                  type="radio"
                  value={1}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  onChange={addFiltro}
                  checked={filtros.valido == 1}
                />
                <span className="text-sm text-gray-700">Válidas</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <input
                  id="valido-2"
                  name="valido"
                  type="radio"
                  value={2}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  onChange={addFiltro}
                  checked={filtros.valido == 2}
                />
                <span className="text-sm text-gray-700">Canceladas</span>
              </label>
            </div>
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
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {matriculasFiltradas.map((matricula) => (
                  <tr
                    key={matricula.id}
                    className={`hover:bg-gray-50 ${!matricula.valido ? 'bg-gray-200' : ''}`}
                  >
                    <td className="px-6 py-4">{matricula.aluno.ra}</td>
                    <td className="px-6 py-4">{matricula.aluno.pessoa.nome}</td>
                    <td className="px-6 py-4">{matricula.anoLetivo.inicio.substring(0, 4)}</td>
                    <td className="px-6 py-4">{matricula.serie.serieDescr}</td>
                    <td className="px-6 py-4">{matricula.turma ? matricula.turma.letra : 'Indefinido'}</td>
                    <td className="px-6 py-4">{matricula.valido? 'valida' : 'Cancelada'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-20">
                      <button
                        onClick={() => cancelarMatricula(matricula)}
                        disabled={!matricula.valido}
                        className={`transition-all ${matricula.valido ? 'text-yellow-500 hover:text-yellow-700' : 'text-gray-400 cursor-not-allowed'}`}
                        title="Cancelar matrícula"
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => excluirMatricula(matricula)}
                        disabled={!matricula.valido}
                        className={`transition-all ${matricula.valido ? 'text-red-500 hover:text-red-700' : 'text-gray-400 cursor-not-allowed'}`}
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
      <Toaster position="top-center" />
    </div>

  );
}
