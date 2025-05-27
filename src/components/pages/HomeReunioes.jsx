import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Page from "../layouts/Page";
import FormularioReunioes from "./cadastros/FormularioReunioes.jsx";
import TabelaReunioes from "./tabelas/TabelaReuniao";
import {
  buscarTodasReunioes,
  gravarReuniao,
  alterarReuniao,
  excluirReuniao as excluirReuniaoService,
} from '../../service/reuniaoService.js';

export default function HomeReunioes() {
  const [reunioes, setReunioes] = useState([]);
  const [reuniaoEmEdicao, setReuniaoEmEdicao] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function carregar() {
      const resposta = await buscarTodasReunioes();
      if (resposta.status) {
        const ordenadas = [...resposta.reunioes].sort((a, b) => new Date(a.reuniaoData) - new Date(b.reuniaoData));
        setReunioes(ordenadas);
      }
      else {
        toast.error(resposta.mensagem);
      }
    }
    carregar();
  }, []);

  function editarReuniao(reuniao) {
    let data = new Date(reuniao.reuniaoData);

    // Adiciona 3 horas
    data.setHours(data.getHours() + 3);

    // Função para preencher com zero à esquerda
    const pad = (num) => String(num).padStart(2, '0');

    // Formata no padrão yyyy-MM-ddTHH:mm
    const dataFormatada = `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(data.getHours())}:${pad(data.getMinutes())}`;

    setReuniaoEmEdicao({
      ...reuniao,
      serie_id: reuniao.serie?.serieId,
      anoletivo_id: reuniao.anoLetivo?.id,
      letra: reuniao.turma?.letra || reuniao.letra,
      tipo: reuniao.reuniaoTipo,
      reuniaoData: dataFormatada,
      data: data
    });

    setMostrarFormulario(true);
    toast('Você está alterando uma reunião!', { icon: '⚠️' });
  }


  function excluirReuniao(id) {
    toast.promise(
      excluirReuniaoService(id).then(async () => {
        const atualizadas = await buscarTodasReunioes();
        setReunioes(atualizadas.reunioes);
      }),
      {
        loading: 'Excluindo...',
        success: 'Reunião excluída com sucesso!',
        error: 'Erro ao excluir reunião',
      }
    );
  }

  function criarReuniao() {
    setReuniaoEmEdicao({
      serie_id: '',
      anoletivo_id: '',
      letra: '',
      tipo: '',
      data: '',
    });
    setMostrarFormulario(true);
  }

  function cancelarEdicao() {
    setReuniaoEmEdicao(null);
    setMostrarFormulario(false);
  }

  function salvarReuniao(reuniao, emEdicao) {
    const acao = emEdicao
      ? alterarReuniao(reuniao)
      : gravarReuniao(reuniao);

    toast.promise(
      acao.then(async (res) => {
        if (!res.status) throw new Error(res.mensagem || "Erro");
        const atualizadas = await buscarTodasReunioes();
        setReunioes(atualizadas.reunioes);
        cancelarEdicao();
      }),
      {
        loading: emEdicao ? 'Atualizando...' : 'Cadastrando...',
        success: emEdicao ? 'Reunião atualizada!' : 'Reunião cadastrada!',
        error: 'Erro ao salvar reunião',
      }
    );
  }

  async function buscarPorTermo(termo) {
    setBusca(termo);

    if (termo.trim() === "") {
      const todas = await buscarTodasReunioes();
      if (todas.status) {
        const ordenadas = [...todas.reunioes].sort(
          (a, b) => new Date(a.reuniaoData) - new Date(b.reuniaoData)
        );
        setReunioes(ordenadas);
      } 
      else {
        toast.error(todas.mensagem);
      }
      return;
    }

    // Se for data no formato brasileiro dd/mm/yyyy
    const dataBR = termo.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dataBR) {
      const dataISO = `${dataBR[3]}-${dataBR[2]}-${dataBR[1]}`;
      return filtrarPorData(dataISO);
    }
  }

  async function filtrarPorData(dataString) {
    const todas = await buscarTodasReunioes();
    if (!todas.status) {
      toast.error(todas.mensagem);
      return;
    }

    const reunioesFiltradas = todas.reunioes.filter((r) => {
      const data = new Date(r.reuniaoData);
      const dataFormatada = data.toISOString().slice(0, 10); // yyyy-mm-dd
      return dataFormatada === dataString;
    });

    if (reunioesFiltradas.length === 0) {
      toast('Nenhuma reunião encontrada para essa data!', { icon: '📅' });
    }

    setReunioes(reunioesFiltradas);
  }

  function confirmarExclusao(reuniaoId) {
  toast.custom((t) => (
    <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg flex flex-col gap-2 border border-red-600 w-[280px]">
      <span className="text-sm">Deseja excluir esta reunião?</span>
      <div className="flex justify-end gap-2 text-sm">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            excluirReuniao(reuniaoId); 
          }}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Confirmar
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  ));
}

  return (
    <div>
      <Toaster position="top-center" />
      <Page />
      <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-4xl px-4 space-y-8">
          {!mostrarFormulario && (
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Reuniões Agendadas</h2>
                <button onClick={criarReuniao} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg">
                  <Plus className="w-4 h-4" /> Agendar
                </button>
              </div>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por data (DD/MM/AAAA)..."
                    value={busca}
                    onChange={(e) => buscarPorTermo(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-700 rounded-lg bg-gray-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-700">
                <TabelaReunioes
                  reunioes={reunioes}
                  editarReuniao={editarReuniao}
                  confirmarExclusao={confirmarExclusao}
                />
              </div>
            </div>
          )}

          {mostrarFormulario && (
            <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
              <FormularioReunioes
                reuniaoEmEdicao={reuniaoEmEdicao}
                salvarReuniao={salvarReuniao}
                cancelarEdicao={cancelarEdicao}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}