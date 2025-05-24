import React, { useState, useEffect } from 'react';
import { Hash, Loader2, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import logoPrefeitura from '../../../assets/images/logoPrefeitura.png';
import ESTADO from '../../../redux/estados';
import { incluirSalas, atualizarSalas } from '../../../redux/salaReducer';
import toast, { Toaster } from 'react-hot-toast';

function CadastroSalas(props) {
  const dispatch = useDispatch();
  const { estado, mensagem } = useSelector((state) => state.sala);

  const [sala, setSalaLocal] = useState(
    props.sala || { id :0, ncarteiras: 0, descricao: ''}
  );

  useEffect(() => {
    if (props.sala) {
      setSalaLocal(props.sala);
    }
  }, [props.sala]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'ncarteiras' ? parseInt(value, 10) : value;
    setSalaLocal((prev) => ({ ...prev, [name]: newValue }));
  };


  const limparFormulario = () => {
    const salaLimpa = { id: 0, ncarteiras: 0, descricao: '' };
    props.setSala(salaLimpa);
    setSalaLocal(salaLimpa);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sala.ncarteiras <= 0) {
      toast.error('Preencha todos os campos corretamente');
    }else{
      console.log(sala);
      let resultAction;
      if (props.salaEdicao) {
        resultAction = await dispatch(atualizarSalas(sala));
        props.setSalaEdicao(false);
      } else {
        resultAction = await dispatch(incluirSalas(sala));
      }
      if (resultAction.error) {
        toast.error('Erro: ' + (resultAction.error.message || 'Falha na operação'));
      } else {
        toast.success('Operação realizada com sucesso!');
      }
      limparFormulario();
      setTimeout(() => {
        props.setExibirTabela(true);
      }, 4000);
    }
  };

  if (estado === ESTADO.PENDENTE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          {mensagem}
        </div>
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
          onClick={() => props.setExibirTabela(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-4xl">
          <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col items-center mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-wide">
                {props.salaEdicao ? 'Editar Sala' : 'Cadastrar Sala'}
              </h2>
              <img
                src={logoPrefeitura}
                alt="Logo da Prefeitura"
                className="h-16 sm:h-20 md:h-24 w-auto"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-1">
                      <Hash className="w-4 h-4" />
                      Número de Carteiras
                    </label>
                    <input
                      type="number"
                      name="ncarteiras"
                      id="ncarteiras"
                      required
                      value={sala.ncarteiras}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Digite o número de carteiras"
                    />
                    <label className="flex items-center gap-2 text-sm font-medium text-white mb-1">
                      <Hash className="w-4 h-4" />
                      Nome para Sala
                    </label>
                    <input
                      type="text"
                      name="descricao"
                      id="descricao"
                      required
                      value={sala.descricao}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Digite o nome da sala"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {props.salaEdicao ? 'Alterar' : 'Confirmar'}
              </button>

              <button
                type="button"
                onClick={() => {
                  limparFormulario();
                  props.setSalaEdicao(false);
                  props.setExibirTabela(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
              >
                Voltar
              </button>
            </form>
          </div>
        </div>
      </div>
    </> 
  );
}

export default CadastroSalas;
