import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Page from "../layouts/Page";
import FormularioReunioes from "./cadastros/FormularioReuniao";
import TabelaReunioes from "./tabelas/TabelaReuniao";
import { reunioesMockadas } from "../../mockDados/mockReunioes";

export default function HomeReunioes() {
  const [reunioes, setReunioes] = useState([]);
  const [reuniaoEmEdicao, setReuniaoEmEdicao] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    setReunioes(reunioesMockadas);
  }, []);

  function editarReuniao(reuniao) {
    setReuniaoEmEdicao(reuniao);
    setMostrarFormulario(true);
    toast('Você está alterando uma reunião!', { icon: '⚠️' });
  }

  function cancelarEdicao() {
    setReuniaoEmEdicao(null);
    setMostrarFormulario(false);
  }

  function getProximoId() {
    if (reunioes.length === 0) return 1;
    const ids = reunioes.map(r => Number(r.id));
    return Math.max(...ids) + 1;
  }  

  function salvarReuniao(reuniao, emEdicao) {
    const nova = {
      ...reuniao,
      id: emEdicao ? reuniao.id : getProximoId(),
    };
  
    const acao = emEdicao
      ? new Promise(resolve => {
          setReunioes(reunioes.map(r => (r.id === nova.id ? nova : r)));
          resolve();
        })
      : new Promise(resolve => {
          setReunioes([...reunioes, nova]);
          resolve();
        });
  
    toast.promise(
      acao.then(() => cancelarEdicao()),
      {
        loading: emEdicao ? 'Atualizando...' : 'Cadastrando...',
        success: emEdicao ? 'Reunião atualizada!' : 'Reunião cadastrada!',
        error: 'Erro ao salvar',
      }
    );
  }
  

  function excluirReuniao(reuniao) {
    toast.promise(
      new Promise(resolve => {
        setTimeout(() => {
          setReunioes(reunioes.filter(r => r.id !== reuniao.id));
          resolve();
        }, 500);
      }),
      {
        loading: 'Excluindo...',
        success: 'Reunião excluída com sucesso!',
        error: 'Erro ao excluir reunião',
      }
    );
  }

  async function buscarPorLetra(termo) {
    if (/\d/.test(termo)) {
      toast.error("A busca deve conter apenas letras, sem números.", { duration: 2000 });
    } else {
      setBusca(termo);
      const resultado = reunioesMockadas.filter(r =>
        r.turmaLetra.toLowerCase().includes(termo.toLowerCase())
      );
      setReunioes(resultado);
    }
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
                <button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg">
                  <Plus className="w-4 h-4" /> Agendar
                </button>
              </div>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por letra da turma..."
                    value={busca}
                    onChange={(e) => buscarPorLetra(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-700 rounded-lg bg-gray-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-700">
                <TabelaReunioes
                  reunioes={reunioes}
                  editarReuniao={editarReuniao}
                  excluirReuniao={excluirReuniao}
                />
              </div>
            </div>
          )}

          {mostrarFormulario && (
            <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {reuniaoEmEdicao ? 'Editar Reunião' : 'Agendar Reunião'}
              </h2>
              <FormularioReunioes
                salvarReuniao={salvarReuniao}
                reuniaoEmEdicao={reuniaoEmEdicao}
                cancelarEdicao={cancelarEdicao}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
