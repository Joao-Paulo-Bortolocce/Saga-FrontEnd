import { useState, useEffect } from 'react';
import { consultarMatriculaFiltros } from '../../../service/serviceMatricula.js';
import { gravarFrequencia } from '../../../service/serviceFrequencia.js';

export default function CadastroFrequencia(props) {
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({});
  const [dataChamada, setDataChamada] = useState("");

  useEffect(() => {
    if (props.turma) {
      buscarAlunos(props.turma);
    }
  }, [props.turma]);

  async function buscarAlunos(turma) {
    const lista = await consultarMatriculaFiltros(turma);
    const listaFiltradas = lista
      .filter(item => item.turma.letra.toLowerCase() === turma.letra.toLowerCase())
      .sort((a, b) => a.aluno.ra - b.aluno.ra);

    setAlunos(listaFiltradas ?? []);
  }

  function marcarPresenca(ra, presente) {
    setPresencas(prev => ({ ...prev, [ra]: presente }));
  }

  function voltar() {
    props.setExibirTabela(true);
  }

  async function confirmarPresenca() {
    if (!dataChamada) return alert("Por favor, selecione a data da chamada.");
    if (alunos.length === 0) return alert("Nenhum aluno disponível para registrar presença.");

    let sucessoTotal = true;

    for (const aluno of alunos) {
      const dados = {
        id: aluno.id,
        presente: presencas[aluno.aluno.ra] === true,
        data: dataChamada
      };

      try {
        const resposta = await gravarFrequencia(dados);
        if (!resposta.status) {
          sucessoTotal = false;
          console.error(`Erro ao gravar frequência para RA ${aluno.aluno.ra}:`, resposta.mensagem);
        }
      } catch (error) {
        sucessoTotal = false;
        console.error(`Erro de conexão para RA ${aluno.aluno.ra}:`, error);
      }
    }

    alert(sucessoTotal
      ? `Presença registrada com sucesso para a turma ${props.turma.serie.serieDescr} - ${props.turma.letra} na data ${dataChamada}`
      : "Ocorreram erros ao registrar uma ou mais presenças. Verifique o console.");

    voltar();
  }

  return (
    <div className="min-h-screen py-12 flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('/src/assets/images/imagemFundoPrefeitura.png')` }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Chamada - {props.turma.serie.serieDescr} - {props.turma.letra}
          </h2>

          <div className="mb-4">
            <label htmlFor="data" className="text-white">Escolha a data:</label>
            <input
              type="date"
              id="data"
              value={dataChamada}
              onChange={(e) => setDataChamada(e.target.value)}
              className="block mt-1 p-2 border border-gray-700 rounded bg-white text-black w-full"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-white divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">RA</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Nome</th>
                  <th className="px-6 py-3 text-center text-sm font-medium">Presente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {alunos.length > 0 ? (
                  alunos.map((aluno) => (
                    <tr key={aluno.id}>
                      <td className="px-6 py-4">{aluno.aluno.ra}</td>
                      <td className="px-6 py-4">{aluno.aluno.pessoa.nome}</td>
                      <td className="px-6 py-4 text-center">
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
                    <td colSpan="3" className="px-6 py-4 text-center text-red-500">
                      Nenhum aluno encontrado!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-end">
            <button
              onClick={confirmarPresenca}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Confirmar
            </button>
            <button
              onClick={voltar}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
