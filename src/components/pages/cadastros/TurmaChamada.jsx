import { useState, useEffect } from 'react';
import { consultarMatriculaFiltros } from '../../../service/servicoMatricula.js';
import { gravarFrequencia } from '../../../service/serviceFrequencia.js';

export default function TurmaSelecionada({ turma, voltar }) {
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({});
  const [dataChamada, setDataChamada] = useState("");

  useEffect(() => {
    if (turma) {
      buscarAlunos(turma);
    }
  }, [turma]);

  async function buscarAlunos(turma) {
    const lista = await consultarMatriculaFiltros(turma); 
    
    const listaFiltradas = lista
      .filter((item) => item.turma.letra.toLowerCase() === turma.letra.toLowerCase())
      .sort((a, b) => a.aluno.ra - b.aluno.ra);

    setAlunos(listaFiltradas ?? []);
  }

  function marcarPresenca(ra, presente) {
    setPresencas((prev) => ({ ...prev, [ra]: presente }));
  }

  async function confirmarPresenca() {
    if (!dataChamada) {
      alert("Por favor, selecione a data da chamada.");
      return;
    }

    if (alunos.length === 0) {
      alert("Nenhum aluno disponível para registrar presença.");
      return;
    }

    let sucessoTotal = true;

    for (const aluno of alunos) {
      const id = aluno.id;
      const presente = !presencas[aluno.aluno.ra];

      const dados = {
        id: id,
        presente: presente,
        data: dataChamada
      };      

      try {
        const resposta = await gravarFrequencia(dados);
        if (!resposta.status) {
          sucessoTotal = false;
          console.error(`Erro ao gravar frequência para RA ${id}:`, resposta.mensagem);
        }
      } catch (error) {
        sucessoTotal = false;
        console.error(`Erro de conexão/fetch para RA ${id}:`, error);
      }
    }

    if (sucessoTotal) {
      alert(`Presença registrada com sucesso para a turma ${turma.serie.serieDescr} - ${turma.letra} na data ${dataChamada}`);
    } else {
      alert("Ocorreram erros ao registrar uma ou mais presenças. Verifique o console.");
    }

    voltar();
  }

  return (
    <>
      <div className="bg-gray-700 text-white p-3 w-fit rounded mb-2">
        <p>Chamada da {turma.serie.serieDescr} - {turma.letra}</p>
        <label htmlFor="data">Escolha a data:</label>
      </div>
      <div className="mb-4">
        <input
          type="date"
          id="data"
          value={dataChamada}
          onChange={(e) => setDataChamada(e.target.value)}
          className="p-2 border border-gray-700 rounded bg-white text-black"
        />
      </div>

      <table className="w-full border border-black bg-black">
        <thead className="bg-gray-500">
          <tr>
            <th className="p-3 text-black">RA</th>
            <th className="p-3 text-black">Nome</th>
            <th className="p-3 text-black">Falta</th>
          </tr>
        </thead>
        <tbody>
          {alunos.length > 0 ? (
            alunos.map((aluno) => (
              <tr key={aluno.id} className="border-t border-gray-700">
                <td className="p-3 text-center">{aluno.aluno.ra}</td>
                <td className="p-3 text-center">{aluno.aluno.pessoa.nome}</td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={presencas[aluno.aluno.ra] || false}
                    onChange={(e) => marcarPresenca(aluno.aluno.ra, e.target.checked)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 text-center text-red-600">
                Nenhum aluno encontrado!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex gap-4 mt-4">
        <button
          onClick={confirmarPresenca}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Confirmar
        </button>
        <button
          onClick={voltar}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
      </div>
    </>
  );
}
