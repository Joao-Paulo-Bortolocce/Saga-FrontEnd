import { useEffect, useState } from "react";
import Page from "../layouts/Page";
import { consultarBimestre } from "../../service/serviceBimestre";
import toast from "react-hot-toast";
import { consultarFichaDaMatricula } from "../../service/serviceFichaDaMatricula";
import ValidaPage from "./ValidaPage";

export default function HomeValidacao() {
  const [filtro, setFiltro] = useState("");
  const [bimestres, setBimestres] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [bimestreSelecionado, setBimestreSelecionado] = useState("");
  const [validando, setValidando] = useState(false);
  const [fichaValidacao, setFichaValidacao] = useState(null);

  useEffect(() => {
    consultarBimestre()
      .then((resultado) => {
        if (resultado.status) setBimestres(resultado.listaDeBimestres);
        else toast.error("Impossível recuperar bimestres");
      })
      .catch(() => {
        toast.error("Erro ao buscar bimestres!");
      });

    consultarFichaDaMatricula()
      .then((resultado) => {
        if (Array.isArray(resultado)) setFichas(resultado);
        else {
          toast.error("Erro ao buscar fichas!");
          setFichas([])
        }
        
      })
      .catch(() => {
        setFichas([])
        toast.error("Falha ao buscar fichas!");

      });
  }, [validando]);

  const manipularInput = (e) => setFiltro(e.target.value.toLowerCase());
  const manipularBimestre = (e) => setBimestreSelecionado(e.target.value);

  const fichasFiltradas = fichas.filter((f) => {
    const nome = f?.matricula?.aluno?.pessoa?.nome?.toLowerCase() || "";
    const serie = f?.matricula?.serie?.serieDescr?.toLowerCase() || "";
    const bimestreId = String(f?.ficha.ficha_bimestre_id || "");

    const correspondeFiltro =
      nome.includes(filtro) ||
      serie.includes(filtro) ||
      bimestreId.includes(filtro);

    const correspondeBimestre =
      bimestreSelecionado === "" || bimestreId === bimestreSelecionado;

    return correspondeFiltro && correspondeBimestre;
  });

  function validar(ficha) {
    setFichaValidacao(ficha);
    setValidando(true);
  }

  // Função para sair do modo de validação e forçar recarga das fichas
  function sairDaValidacao() {
    setFichaValidacao(null);
    setValidando(false);
  }

  return (
    <>
      <Page />
      {validando ? (
        <ValidaPage
          fichaValidacao={fichaValidacao}
          setFichaValidacao={setFichaValidacao}
          setValidando={sairDaValidacao} 
          validadas={false}  // Passa a função para limpar e recarregar
        />
      ) : (
        <main className="flex flex-col items-center px-4 py-6">
          {/* Filtros */}
          <section className="flex flex-wrap gap-4 justify-center w-full max-w-6xl mb-8">
            <input
              type="text"
              placeholder="Digite um filtro..."
              className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filtro}
              onChange={manipularInput}
            />

            <select
              className="min-w-[200px] px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bimestreSelecionado}
              onChange={manipularBimestre}
            >
              <option value="">Todos os bimestres</option>
              {bimestres.map((b) => (
                <option key={b.bimestre_id} value={b.bimestre_id}>
                  {b.bimestre_id}
                </option>
              ))}
            </select>
          </section>

          {/* Grid de Fichas */}
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Fichas por Bimestre
          </h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {fichasFiltradas.map((ficha, idx) => (
              <div
                key={idx}
                className="transition-all duration-200 hover:scale-[1.03] bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer"
                onClick={() => validar(ficha)}
              >
                <div className="bg-red-500 h-2 w-full" />
                <div className="p-5 flex flex-col items-center">
                  <p className="text-center font-semibold text-gray-800">
                    {ficha?.matricula?.aluno?.pessoa?.nome || "Aluno não informado"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {ficha?.matricula?.serie?.serieDescr || "Série não informada"}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    Bimestre: {ficha?.ficha.ficha_bimestre_id || "Sem bimestre"}
                  </p>
                </div>
              </div>
            ))}
            {fichasFiltradas.length === 0 && (
              <p className="col-span-full text-center text-black bg-white py-4 px-6 rounded-lg shadow">

                Nenhuma ficha encontrada !
              </p>
            )}
          </section>
        </main>
      )}
    </>
  );
}
