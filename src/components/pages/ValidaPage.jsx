import { useEffect, useState } from "react";
import { Printer, GraduationCap, User } from 'lucide-react';
import { alterarFichaDaMatricula, consultarAvaliacoesDaFichaDaMatricula } from "../../service/serviceFichaDaMatricula";
import { consultarHabilidadesDaFicha } from "../../service/serviceHabilidadesDaFicha.js";
import { consultarHabMat } from "../../service/serviceHabilidade.js"; // certifique-se que esse import está correto
import AssessmentButton from "../AssessmentButton.jsx";
import toast from "react-hot-toast";

function ValidaPage({ fichaValidacao, setValidando, setFichaValidacao, validadas }) {
  const [comentario, setComentario] = useState(fichaValidacao.observacao || "");
  const [habilidades, setHabilidades] = useState([]);

 useEffect(() => {
  const toastId = toast.loading("Carregando habilidades...");

  consultarAvaliacoesDaFichaDaMatricula(
    fichaValidacao.matricula.id,
    fichaValidacao.ficha.ficha_id
  )
    .then((avaliacoesResultado) => {
      if (!Array.isArray(avaliacoesResultado)) {
        toast.error("Erro ao consultar avaliações da matrícula");
        toast.dismiss(toastId);
        return;
      }

      consultarHabilidadesDaFicha(fichaValidacao.ficha.ficha_id)
        .then(async (res) => {
          if (!res.status) {
            toast.error("Erro ao consultar habilidades da ficha");
            toast.dismiss(toastId);
            return;
          }

          const habilidadesDaFicha = res.listaDeHabilidadesDaFicha;

          const habilidadesComDetalhes = await Promise.all(
            habilidadesDaFicha.map(async (hab) => {
              const avaliacao = avaliacoesResultado.find(
                (ava) => ava.avaHabId === hab.habilidadesDaFicha_id
              );

              try {
                const detResponse = await consultarHabMat(hab.habilidadesDaFicha_habilidades_id);

                if (
                  detResponse &&
                  detResponse.status &&
                  Array.isArray(detResponse.listaDeHabilidades) &&
                  detResponse.listaDeHabilidades.length > 0
                ) {
                  const detalhes = detResponse.listaDeHabilidades[0];

                  return {
                    ...hab,
                    avaliacao: avaliacao || null,
                    descricao: detalhes.descricao,
                    cod: detalhes.cod
                  };
                }
              } catch (error) {
                console.error(`Erro ao buscar detalhes da habilidade ${hab.habilidadesDaFicha_habilidades_id}:`, error);
              }

              return {
                ...hab,
                avaliacao: avaliacao || null,
                descricao: `Habilidade ${hab.habilidadesDaFicha_habilidades_id}`,
                cod: hab.habilidadesDaFicha_habilidades_id
              };
            })
          );

          setHabilidades(habilidadesComDetalhes);
          toast.dismiss(toastId);
        })
        .catch(() => {
          toast.error("Erro ao consultar habilidades da ficha");
          toast.dismiss(toastId);
        });
    })
    .catch(() => {
      toast.error("Erro ao consultar avaliações da matrícula");
      toast.dismiss(toastId);
    });
}, [fichaValidacao]);


  function aprovarValidacao() {
    const novaFicha = {
      ficha: fichaValidacao.ficha,
      matricula: fichaValidacao.matricula,
      observacao: comentario,
      status: 3
    };

    alterarFichaDaMatricula(novaFicha)
      .then((resultado) => {
        if (resultado.status) {
          setFichaValidacao(null);
          setValidando();
        } else {
          toast.error("Ocorreu um erro ao aprovar a validação");
        }
      })
      .catch(() => {
        toast.error("Ocorreu um erro ao aprovar a validação");
      });
  }

  function reprovarValidacao() {
    const novaFicha = {
      ficha: fichaValidacao.ficha,
      matricula: fichaValidacao.matricula,
      observacao: comentario,
      status: 1
    };

    alterarFichaDaMatricula(novaFicha)
      .then((resultado) => {
        if (resultado.status) {
          setFichaValidacao(null);
          setValidando();
        } else {
          toast.error("Ocorreu um erro ao reprovar a validação");
        }
      })
      .catch(() => {
        toast.error("Ocorreu um erro ao reprovar a validação");
      });
  }

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

          {habilidades.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma habilidade encontrada.</p>
          ) : (
            <div className="space-y-4">
              {habilidades.map((habilidade) => (
                <div key={habilidade.habilidadesDaFicha_id} className="py-4 grid grid-cols-7 gap-4 items-start border-b border-gray-100">
                  <div className="col-span-4">
                    <div className="mb-2">
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {habilidade.descricao}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>ID da Habilidade: {habilidade.habilidadesDaFicha_habilidades_id}</p>
                      <p>ID da Ficha: {fichaValidacao.ficha.ficha_id}</p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="flex justify-around gap-2">
                      <AssessmentButton value="NA" currentValue={habilidade.avaliacao?.avaAv} color="red" />
                      <AssessmentButton value="EC" currentValue={habilidade.avaliacao?.avaAv} color="yellow" />
                      <AssessmentButton value="A" currentValue={habilidade.avaliacao?.avaAv} color="green" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comentário e Ações */}
        {!validadas && (
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Comentário</h3>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={4}
                placeholder="Escreva seu comentário sobre a avaliação..."
                className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap justify-end gap-4">
              <button
                onClick={aprovarValidacao}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                Aprovar validação
              </button>
              <button
                onClick={reprovarValidacao}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Reprovar validação
              </button>
              <button
                onClick={() => setValidando()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ValidaPage;
