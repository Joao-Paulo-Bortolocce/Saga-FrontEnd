import { useState, useEffect } from 'react';
import { mockMatricula } from './dados/mockMatricula';

export default function TurmaSelecionada({ turma, voltar }) {
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({});

  useEffect(() => {
    const filtrados = mockMatricula.filter(a => a.turmalet === turma.letra && a.turmaser === turma.serie);
    setAlunos(filtrados);
  }, [turma.letra]);

  function marcarPresenca(ra, presente) {
    setPresencas(prev => ({ ...prev, [ra]: presente }));
  }

  function confirmarPresenca() {
    alert(`Presença registrada para a turma ${turma.serie} - ${turma.letra} no dia ${dataAtual}`);
    voltar();
  }

  const dataAtual = new Date().toLocaleDateString('pt-BR');

  return (
    <>
      <h2>Chamada da {turma.serie} - {turma.letra} ({dataAtual})</h2>
      <table className="w-full border border-black bg-black">
        <thead className="bg-gray-500">
          <tr>
            <th className="p-3 text-black">RA</th>
            <th className="p-3 text-black">Nome</th>
            <th className="p-3 text-black">Presente</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map(aluno => (
            <tr key={aluno.ra} className="border-t border-gray-700">
              <td className="p-3 text-center">{aluno.ra}</td>
              <td className="p-3 text-center">{aluno.nome}</td>
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={presencas[aluno.ra] || false}
                  onChange={(e) => marcarPresenca(aluno.ra, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-4">
        <button onClick={confirmarPresenca}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Confirmar
        </button>
        <button onClick={voltar}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Voltar
        </button>
      </div>
    </>
  );
}