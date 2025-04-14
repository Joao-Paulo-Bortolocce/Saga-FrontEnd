import React, { useState } from 'react';
import { Hash, BookOpen, User, MapPin, Home } from 'lucide-react';
import logoPrefeitura from "../../../assets/images/logoPrefeitura.png";
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados.js';
import { incluirPessoa, atualizarPessoa } from '../../../redux/pessoaReducer.js';
import { formatarCEP, formatarCPF, formatarRG } from '../../../service/formatadores.js';
import { consultarPessoa } from '../../../service/pessoaService.js';

function CadastroPessoa(props) {
  const [pessoa, setPessoa] = useState(props.pessoa);
  const { estado, mensagem } = useSelector(state => state.pessoa);
  const dispachante = useDispatch();


  function manipularMudanca(event) {
    const id = event.currentTarget.id;
    let valor = event.currentTarget.value;
    if (id === 'dataNascimento') {
      let atual = new Date();
      let dataInformada = new Date(valor);

      if (dataInformada > atual) {
        alert("A data informada é inválida");
        valor = dataInformada.toLocaleString().substring(0, 10);
      }
    }

    if (id === 'cpf')
      valor = formatarCPF(valor, pessoa.cpf.length < valor.length);


    if (id.startsWith('endereco.')) {
      const idAux = id.split('.')[1];
      if (idAux === "cep")
        valor = formatarCEP(valor, pessoa.endereco.cep.length < valor.length);
      setPessoa({
        ...pessoa,
        endereco: {
          ...pessoa.endereco,
          [idAux]: valor
        }
      });
    } else {
      setPessoa({ ...pessoa, [id]: valor });
    }
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
      estadoCivil: "",
      endereco: {
        rua: "",
        numero: "",
        complemento: "",
        cep: "",
        uf: "",
        cidade: ""
      }
    })
  }

  function verificaCPF() {
    if (!props.modoEdicao && pessoa.cpf != "") {

      consultarPessoa(pessoa.cpf).then((consulta) => {
        if (consulta != undefined && consulta != null && consulta != []) {
          alert("O cpf: " + pessoa.cpf + " ja esta sendo utilizado");
          setPessoa({ ...pessoa, ["cpf"]: "" });
        }

      })
    }
  }

  function handleSubmit(evento) {
    if (props.modoEdicao) {
      dispachante(atualizarPessoa(pessoa));
      props.setExibirTabela(true);
      props.setModoEdicao(false);
      zeraPessoa();
    }
    else {
      dispachante(incluirPessoa(pessoa));
      props.setExibirTabela(true);
      zeraPessoa();
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
  else if (estado === ESTADO.ERRO) {
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
      className="flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
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
                    maxLength={14}
                    minLength={14}
                    disabled={props.modoEdicao}
                    required
                    onBlur={verificaCPF}
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
                    disabled={props.modoEdicao}
                    maxLength={12}
                    minLength={12}
                    required
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
                    required
                    value={pessoa.dataNascimento.substr(0, 10)}
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
                    required
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
                        required
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
                        required
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
                    <select
                      name="estadoCivil"
                      required
                      id="estadoCivil"
                      value={pessoa.estadoCivil.toUpperCase()}
                      onChange={manipularMudanca}
                    >
                      <option value="">Selecione</option>
                      <option value="SOLTEIRO">Solteiro</option>
                      <option value="CASADO">Casado</option>
                      <option value="DIVORCIADO">Divorciado</option>
                      <option value="VIÚVO">Viúvo</option>
                    </select>
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
                    required
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
                    required
                    value={pessoa.locNascimento}
                    onChange={manipularMudanca}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Digite a cidade que nasceu"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="endereco.rua"
                      className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                    >
                      <Home className="w-4 h-4" />
                      Rua
                    </label>
                    <input
                      type="text"
                      name="endereco.rua"
                      required
                      id="endereco.rua"
                      value={pessoa.endereco.rua}
                      onChange={manipularMudanca}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Digite o nome da rua"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endereco.numero"
                      className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                    >
                      Número
                    </label>
                    <input
                      type="number"
                      name="endereco.numero"
                      required
                      id="endereco.numero"
                      value={pessoa.endereco.numero}
                      onChange={manipularMudanca}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Número"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endereco.complemento"
                      className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                    >
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="endereco.complemento"
                      id="endereco.complemento"
                      value={pessoa.endereco.complemento}
                      onChange={manipularMudanca}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Apartamento, sala, etc."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endereco.cep"
                      className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                    >
                      CEP
                    </label>
                    <input
                      type="text"
                      name="endereco.cep"
                      id="endereco.cep"
                      required
                      maxLength={9}
                      value={pessoa.endereco.cep}
                      onChange={manipularMudanca}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endereco.uf"
                      className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                    >
                      Estado
                    </label>
                    <select
                      name="endereco.uf"
                      required
                      id="endereco.uf"
                      value={pessoa.endereco.uf}
                      onChange={manipularMudanca}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Selecione um estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="endereco.cidade"
                      className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                    >
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="endereco.cidade"
                      id="endereco.cidade"
                      required
                      value={pessoa.endereco.cidade}
                      onChange={manipularMudanca}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Digite a cidade"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
              {props.modoEdicao ? "Alterar" : "Confirmar"}
            </button>
            <button
              onClick={() => {
                zeraPessoa();
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
  );
}

export default CadastroPessoa;