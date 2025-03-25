import React, { useState } from 'react';
import { Hash, BookOpen, User } from 'lucide-react';
import imagemFundoPrefeitura from "../../../assets/images/imagemFundoPrefeitura.png";
import logoPrefeitura from "../../../assets/images/logoPrefeitura.png";
import { gravarPessoa,alterarPessoa } from '../../../service/pessoaService.js';

function CadastroPessoa() {
  const [pessoa, setPessoa] = useState({
    cpf: "",
    rg: "",
    nome: "",
    dataNascimento: "",
    sexo: "",
    locNascimento: "",
    estadoNascimento: "",
    enderecoId: 1,
    estadoCivil: ""
  });

  function manipularMudanca(event) {
    const id = event.currentTarget.id;
    let valor = event.currentTarget.value;
    setPessoa({ ...pessoa, [id]: valor });
  }

  const handleSubmit = (event) => {
    
    const form = event.currentTarget;
    
      try {

        console.log('Dados da pessoa:', pessoa);
        gravarPessoa(pessoa);
        window.alert('Pessoa cadastrada com sucesso!');
      } catch (error) {

        window.alert('Erro ao cadastrar pessoa. Por favor, tente novamente.');
        setPessoa({
          ...pessoa,
          cpf: ""
        });
      }
  
    event.preventDefault();
    event.stopPropagation();
  };
  
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
                        value="masculino"
                        checked={pessoa.sexo === "masculino"}
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
                        value="feminino"
                        checked={pessoa.sexo === "feminino"}
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
                        checked={pessoa.estadoCivil === "casado"}
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
                        checked={pessoa.estadoCivil === "solteiro"}
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
                    <option value="Amapa">Amapá</option>
                    <option value="Amazonas">Amazonas</option>
                    <option value="Bahia">Bahia</option>
                    <option value="Ceara">Ceará</option>
                    <option value="Distrito Federal">Distrito Federal</option>
                    <option value="Espirito Santo">Espírito Santo</option>
                    <option value="Goias">Goiás</option>
                    <option value="Maranhao">Maranhão</option>
                    <option value="Mato Grosso">Mato Grosso</option>
                    <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                    <option value="Minas Gerais">Minas Gerais</option>
                    <option value="Para">Pará</option>
                    <option value="Paraiba">Paraíba</option>
                    <option value="Parana">Paraná</option>
                    <option value="Pernambuco">Pernambuco</option>
                    <option value="Piaui">Piauí</option>
                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                    <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                    <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                    <option value="Rondonia">Rondônia</option>
                    <option value="Roraima">Roraima</option>
                    <option value="Santa Catarina">Santa Catarina</option>
                    <option value="Sao Paulo">São Paulo</option>
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
              Confirmar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroPessoa;