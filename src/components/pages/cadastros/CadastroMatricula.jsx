import React, { useState } from 'react';
import logoPrefeitura from "../../../assets/images/logoPrefeitura.png";
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados.js';
import { incluirMatricula, atualizarMatricula } from '../../../redux/matriculaReducer.js';
import { consultarMatricula } from '../../../service/matriculaService.js';

function CadastroMatricula(props) {
  const [matricula, setMatricula] = useState(props.matricula);
  const { estado, mensagem } = useSelector(state => state.matricula);
  const dispachante = useDispatch();


  /*function manipularMudanca(event) {
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
      valor = formatarCPF(valor, matricula.cpf.length < valor.length);


    if (id.startsWith('endereco.')) {
      const idAux = id.split('.')[1];
      if (idAux === "cep")
        valor = formatarCEP(valor, matricula.endereco.cep.length < valor.length);
      setMatricula({
        ...matricula,
        endereco: {
          ...matricula.endereco,
          [idAux]: valor
        }
      });
    } else {
      setMatricula({ ...matricula, [id]: valor });
    }
  }
*/
  function zeraMatricula() {
    props.setMatricula({
      id: 0,
      ra: "",
      aprovado: 0,
      idMatricula: 0,
      Turma_letra: "",
      Turma_Serie_id: 0,
      Turma_AnoLetivo_id: 0,
      Aluno_RA: 0,
      AnoLetivo_id: 0,
      Serie_id: 0
    })
  }

  //   function verificaCPF() {
  //     if (!props.modoEdicao && matricula.cpf != "") {

  //       consultarMatricula(matricula.cpf).then((consulta) => {
  //         if (consulta != undefined && consulta != null && consulta != []) {
  //           alert("O cpf: " + matricula.cpf + " ja esta sendo utilizado");
  //           setMatricula({ ...matricula, ["cpf"]: "" });
  //         }

  //       })
  //     }
  //   }

  function handleSubmit(evento) {
    if (props.modoEdicao) {
      dispachante(atualizarMatricula(matricula));
      props.setExibirTabela(true);
      props.setModoEdicao(false);
      zeraMatricula();
    }
    else {
      dispachante(incluirMatricula(matricula));
      props.setExibirTabela(true);
      zeraMatricula();
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
          onClick={() => dispatch(buscarMatriculas())}
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
              Registro de Matricula
            </h2>
            <img
              src={logoPrefeitura}
              alt="Logo da Prefeitura"
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
          </div>
          <form action="">
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroMatricula;