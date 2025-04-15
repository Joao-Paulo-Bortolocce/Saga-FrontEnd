import React, { useState } from 'react';
import logoPrefeitura from "../../../assets/images/logoPrefeitura.png";
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../../redux/estados.js';
import { incluirMatricula, atualizarMatricula } from '../../../redux/matriculaReducer.js';
import { consultarMatricula } from '../../../service/matriculaService.js';
import { listaDeAlunos } from '../../../mockDados/mockAlunos.js';
import { listaDeanosLetivos } from '../../../mockDados/mockAnoLetivo.js';
import { listaDeTurmas } from '../../../mockDados/mockTurmas.js';
import { listaDeSeries } from '../../../mockDados/mockSeries.js';

function CadastroMatricula(props) {
  const [matricula, setMatricula] = useState(props.matricula);
  const { estado, mensagem } = useSelector(state => state.matricula);
  const dispachante = useDispatch();


  function manipularMudanca(event) {
    const id = event.currentTarget.id;
    let valor = event.currentTarget.value;
      setMatricula({ ...matricula, [id]: valor });
    
  }

  function zeraMatricula() {
    props.setMatricula({
      id: 0,
        ra: "",
        aprovado: 0,
        idMatricula: 0,
        turma_letra: "",
        turma_Serie_id: 0,
        turma_AnoLetivo_id: 0,
        aluno_RA: 0,
        anoLetivo_id: 0,
        serie_id: 0
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
          <form >
            <div className='flex flex-row justify-evenly'>
              <div className='flex flex-col'>
                <label htmlFor="anoLetivo_id" className='text-white'>Ano letivo</label>
                <select id='anoLetivo_id' name='anoLetivo_id' value={matricula.anoLetivo_id} onChange={manipularMudanca}>
                  <option value="0">Selecione</option>
                  {listaDeanosLetivos.map((ano)=>{
                    return (<option value={ano.anoletiv}>{ano.anoletiv}</option> )
                  })}
                </select>
              </div>
              <div className='flex flex-col'>
                <label htmlFor="serie_id" className='text-white'>Series</label>
                <select id='serie_id' name='serie_id' value={matricula.serie_id} onChange={manipularMudanca}>
                  <option value="0">Selecione</option>
                  {listaDeSeries.map((serie)=>{
                    return  (<option value={serie.numero}>{serie.descricao}</option> ) 
                  })}
                </select>
              </div>
              <div className='flex flex-col'>
                <label htmlFor="turma_letra" className='text-white'>Turmas</label>
                <select id='turma_letra' name='turma_letra' value={matricula.turma_letra} onChange={manipularMudanca}>
                  <option value="0">Selecione</option>
                  {listaDeTurmas.map((turma)=>{
                    if(!(matricula.anoLetivo_id!=0 && matricula.anoLetivo_id!=turma.turmaanoletivo_id) || !(matricula.serie_id!=0 && matricula.serie_id!=turma.serieturma_id))
                      return  (<option value={turma.turma_letra}>{turma.serieturma_id+" "+turma.turma_letra}</option> ) 
                  })}
                </select>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroMatricula;