import { useEffect, useState } from "react";
import { Printer, GraduationCap, User, Save } from 'lucide-react';
import { consultarAvaliacoesDaFichaDaMatricula } from "../../service/serviceFichaDaMatricula";
import AssessmentButton from "../AssessmentButton.jsx"
import toast from "react-hot-toast";

function ValidaPage({ fichaValidacao, setValidando }) {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    consultarAvaliacoesDaFichaDaMatricula(
      fichaValidacao.matricula.id,
      fichaValidacao.ficha.ficha_id
    )
      .then((resultado) => {
        if (Array.isArray(resultado)) setAvaliacoes(resultado);
        else toast.error("Erro ao consultar avaliações da matrícula");
      })
      .catch(() => {
        toast.error("Erro ao consultar avaliações da matrícula");
      });
  }, [fichaValidacao]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Sistema de Avaliação</h1>
              <p className="text-sm text-gray-600">Avaliação de Matrícula</p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Printer size={20} />
            <span>Imprimir</span>
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Informações do aluno */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">Informações do Aluno</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-gray-800">{fichaValidacao.matricula.aluno.pessoa.nome}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-gray-500" />
              <span className="text-gray-800">{fichaValidacao.matricula.serie.serieDescr}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Bimestre:</span>
              <span className="text-gray-800">{fichaValidacao.ficha.ficha_bimestre_id}º</span>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">Avaliações da Ficha</h3>

          {avaliacoes.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma avaliação encontrada.</p>
          ) : (
            <div className="space-y-4">
              {avaliacoes.map((avaliacao, index) => (
                      <div key={avaliacao.avaHabld} className="py-4 grid grid-cols-7 gap-4 items-start border-b border-gray-100">
                        <div className="col-span-4">
                          <div className="mb-2">
                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                              {avaliacao.descricao}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>ID da Habilidade: {avaliacao.avaHabld}</p>
                            <p>ID da Ficha: {fichaValidacao.ficha.ficha_id}</p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <div className="flex justify-around gap-2">
                            <AssessmentButton
                              value="NA"
                              currentValue={avaliacao.avaAv}
                              color="red"
                            />
                            <AssessmentButton
                              value="EC"
                              currentValue={avaliacao.avaAv}
                              color="yellow"
                            />
                            <AssessmentButton
                              value="A"
                              currentValue={avaliacao.avaAv}
                              color="green"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
            </div>
          )}
        </div>

        {/* Botão Voltar */}
        <div className="flex justify-end">
          <button
            onClick={() => setValidando(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </main>
    </div>
  );
}

export default ValidaPage;

