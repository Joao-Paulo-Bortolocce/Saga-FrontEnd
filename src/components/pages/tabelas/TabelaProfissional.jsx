import React, { useEffect, useState,useContext } from 'react';
import {
  PlusCircle, Pencil, Trash2, Search, UserPlus, AlertCircle, Loader2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados';
import {
  apagarProfissional,
  buscarProfissionais
} from '../../../redux/profissionalReducer';
import toast from 'react-hot-toast';
import { ContextoUsuario } from '../../../App';

export default function TabelaProfissional(props) {
  const { estado, mensagem, listaDeProfissionais } = useSelector(state => state.profissional);
  const { setUsuario, usuario } = useContext(ContextoUsuario);
  const dispatch = useDispatch();
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    dispatch(buscarProfissionais());
  }, [dispatch]);

  function excluirProfissional(profissional) {
    if (window.confirm(`Deseja realmente excluir ${profissional.profissional_pessoa.nome}?`)) {
      dispatch(apagarProfissional(profissional));
      toast.success("Profissional excluído com sucesso!");
    }
  }

  function alterarProfissional(profissional) {
    props.setModoEdicao(true);
    props.setExibirTabela(false);
    props.setProfissional(profissional);
  }

  useEffect(() => {
    setProfissionaisFiltrados(
      listaDeProfissionais.filter(profissional =>
        profissional.profissional_pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase())
      )
    );
  }, [listaDeProfissionais, pesquisa]);

  const getTipoProfissional = (tipo) => {
    switch (tipo) {
      case 1: return "Secretaria";
      case 2: return "Professor";
      case 3: return "Gestão";
      default: return "Não definido";
    }
  };

  if (estado === ESTADO.PENDENTE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-blue-600 font-medium">{mensagem}</p>
      </div>
    );
  }

  if (estado === ESTADO.ERRO) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
          <AlertCircle className="w-5 h-5 mr-2" />
          {mensagem}
        </div>
        <button
          onClick={() => dispatch(buscarProfissionais())}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Profissionais</h1>
          <p className="text-sm text-gray-500">Lista de profissionais cadastrados no sistema</p>
        </div>
        <button
          onClick={() => props.setExibirTabela(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <UserPlus className="w-5 h-5" />
          Novo Profissional
        </button>
      </div>

      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border rounded-2xl shadow">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
            {usuario.tipo==3?<tr>
              {['RA', 'Nome', 'CPF', 'Tipo', 'Data de Admissão', 'Usuário', 'Ações'].map((title, i) => (
                <th key={i} className="px-6 py-3">{title}</th>
              ))}
            </tr>:
            <tr>
              {['RA', 'Nome', 'CPF', 'Tipo', 'Data de Admissão', 'Usuário'].map((title, i) => (
                <th key={i} className="px-6 py-3">{title}</th>
              ))}
            </tr>
            }
          </thead>
          <tbody className="divide-y divide-gray-100">
            {profissionaisFiltrados.length > 0 ? (
              profissionaisFiltrados.map((profissional) => (
                <tr key={profissional.profissional_ra} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{profissional.profissional_ra}</td>
                  <td className="px-6 py-4">{profissional.profissional_pessoa.nome}</td>
                  <td className="px-6 py-4">{profissional.profissional_pessoa.cpf}</td>
                  <td className="px-6 py-4">{getTipoProfissional(profissional.profissional_tipo)}</td>
                  <td className="px-6 py-4">
                    {new Date(
                      new Date(profissional.profissional_dataAdmissao).setHours(
                        new Date(profissional.profissional_dataAdmissao).getHours() + 3
                      )
                    ).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="px-6 py-4">{profissional.profissional_usuario}</td>
                  <td className="px-6 py-4">
                    {usuario.tipo==3 &&(<div className="flex gap-2">
                      <button
                        onClick={() => alterarProfissional(profissional)}
                        className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => excluirProfissional(profissional)}
                        className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum profissional encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
