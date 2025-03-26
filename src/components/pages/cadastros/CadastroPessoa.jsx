import React, { useState } from 'react';
import { Hash, BookOpen, User } from 'lucide-react';
import imagemFundoPrefeitura from "../../../assets/images/imagemFundoPrefeitura.png";
import logoPrefeitura from "../../../assets/images/logoPrefeitura.png";
import { gravarPessoa, alterarPessoa } from '../../../service/pessoaService.js';
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados.js';
import { incluirPessoa } from '../../../redux/pessoaReducer.js';


function CadastroPessoa(props) {
  const [pessoa, setPessoa] = useState(props.pessoa);
  const { estado, mensagem } = useSelector(state => state.pessoa);
  const dispachante = useDispatch();

  function manipularMudanca(event) {
    const id = event.currentTarget.id;
    let valor = event.currentTarget.value;
    setPessoa({ ...pessoa, [id]: valor });
  }

  function zeraPessoa() {
    props.setPessoa({
      cpf: "",
      rg: "",
      nome: "",
      dataNascimento: "",
      sexo: "",
      locNascimento: "",
      estadoNascimento: "",
      enderecoId: 1,
      estadoCivil: ""
    })
  }

  function handleSubmit(evento) {

    if (props.modoEdicao) {


      dispachante(alterarPessoa(props.pessoa));
      setTimeout(() => {
        props.setExibirTabela(true);
        props.setModoEdicao(false);
        zeraPessoa();

      }, 5000)

    }
    else {

      dispachante(incluirPessoa(props.pessoa));
      setTimeout(() => {
        props.setExibirTabela(true);
        zeraPessoa();

      }, 5000)

    }

    evento.stopPropagation();
    evento.preventDefault();
  }

  if (estado === ESTADO.PENDENTE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">{mensagem}</div>
      </div>
    );
  }
  else
    if (estado === ESTADO.ERRO) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
          <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <AlertCircle className="w-5 h-5 mr-2" />
            {mensagem}
          </div>
          <button
            onClick={() => dispatch(buscarPessoas())}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Voltar
          </button>
        </div>
      );
    }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
      style={{ backgroundImage: `url(${imagemFundoPrefeitura})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-wide">
              Cadastro de Pessoa
            </h2>
            <img
              src={logoPrefeitura}
              alt="Logo da Prefeitura"
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="cpf"
                    className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                  >
                    <Hash className="w-4 h-4" />
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    id="cpf"
                    value={pessoa.cpf}
                    onChange={manipularMudanca}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Digite o CPF"
                  />
                </div>
                <div>
                  <label
                    htmlFor="rg"
                    className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                  >
                    <Hash className="w-4 h-4" />
                    RG
                  </label>
                  <input
                    type="text"
                    name="rg"
                    id="rg"
                    value={pessoa.rg}
                    onChange={manipularMudanca}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Digite o RG"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dataNascimento"
                    className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                  >
                    <BookOpen className="w-4 h-4" />
                    data de Nascimento
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    id="dataNascimento"
                    value={pessoa.dataNascimento}
                    onChange={manipularMudanca}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <label
                    htmlFor="nome"
                    className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                  >
                    <User className="w-4 h-4" />
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    value={pessoa.nome}
                    onChange={manipularMudanca}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Digite o nome"
                  />
                </div>
                <div className="md:col-span-3 space-y-2">
                  <p className="text-sm font-medium text-white mb-1">Sexo</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="sexo"
                        id="sexo"
                        className="w-4 h-4"
                        value="m"
                        checked={pessoa.sexo.toUpperCase() === "M"}
                        onChange={manipularMudanca}
                      />
                      <label
                        htmlFor="masculino"
                        className="text-sm font-medium text-white"
                      >
                        Masculino
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="sexo"
                        id="sexo"
                        className="w-4 h-4"
                        value="F"
                        checked={pessoa.sexo.toUpperCase() === "F"}
                        onChange={manipularMudanca}
                      />
                      <label
                        htmlFor="feminino"
                        className="text-sm font-medium text-white"
                      >
                        Feminino
                      </label>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <p className="text-sm font-medium text-white mb-1">Estado Civil</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="estadoCivil"
                        id="estadoCivil"
                        className="w-4 h-4"
                        value="casado"
                        checked={pessoa.estadoCivil.toUpperCase() === "CASADO"}
                        onChange={manipularMudanca}
                      />
                      <label
                        htmlFor="casado"
                        className="text-sm font-medium text-white"
                      >
                        Casado
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="estadoCivil"
                        id="estadoCivil"
                        className="w-4 h-4"
                        value="solteiro"
                        checked={pessoa.estadoCivil.toUpperCase() === "SOLTEIRO"}
                        onChange={manipularMudanca}
                      />
                      <label
                        htmlFor="solteiro"
                        className="text-sm font-medium text-white"
                      >
                        Solteiro
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="estadoNascimento"
                    className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                  >
                    Estado que nasceu
                  </label>
                  <select
                    name="estadoNascimento"
                    id="estadoNascimento"
                    value={pessoa.estadoNascimento}
                    onChange={manipularMudanca}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um estado</option>
                    <option value="Acre">Acre</option>
                    <option value="Alagoas">Alagoas</option>
                    <option value="Amapá">Amapá</option>
                    <option value="Amazonas">Amazonas</option>
                    <option value="Bahia">Bahia</option>
                    <option value="Ceará">Ceará</option>
                    <option value="Distrito Federal">Distrito Federal</option>
                    <option value="Espírito Santo">Espírito Santo</option>
                    <option value="Goiás">Goiás</option>
                    <option value="Maranhão">Maranhão</option>
                    <option value="Mato Grosso">Mato Grosso</option>
                    <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                    <option value="Minas Gerais">Minas Gerais</option>
                    <option value="Pará">Pará</option>
                    <option value="Paraíba">Paraíba</option>
                    <option value="Paraná">Paraná</option>
                    <option value="Pernambuco">Pernambuco</option>
                    <option value="Piauí">Piauí</option>
                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                    <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                    <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                    <option value="Rondônia">Rondônia</option>
                    <option value="Roraima">Roraima</option>
                    <option value="Santa Catarina">Santa Catarina</option>
                    <option value="São Paulo">São Paulo</option>
                    <option value="Sergipe">Sergipe</option>
                    <option value="Tocantins">Tocantins</option>

                  </select>
                </div>
                <div>
                  <label
                    htmlFor="locNascimento"
                    className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                  >
                    Cidade que Nasceu
                  </label>
                  <input
                    type="text"
                    name="locNascimento"
                    id="locNascimento"
                    value={pessoa.locNascimento}
                    onChange={manipularMudanca}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Digite a cidade que nasceu"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
              {props.modoEdicao ? "Alterar" : "Confirmar"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroPessoa;