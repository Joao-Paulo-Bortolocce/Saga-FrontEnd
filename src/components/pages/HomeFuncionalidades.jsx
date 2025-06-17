import { useState } from "react";
<<<<<<< HEAD
import { BookText, FileText, UserCheck, FolderOpen } from "lucide-react";
=======
import { BookText, FileText, UserCheck, FolderOpen,FileCheck } from "lucide-react";

>>>>>>> joaopaulo
import Page from "../layouts/Page";

const funcionalidades = [
  {
    nome: "Montar Ficha",
    href: "/ficha-montagem",
    tipo: "Criação",
    icon: BookText,
    bgcolor: "bg-purple-800",
    color: "text-purple-800",
    description: "Criar e configurar fichas"
  },
  {
    nome: "Avaliar Matrícula",
    href: "/avalia-matricula",
    tipo: "Avaliação",
    icon: UserCheck,
    bgcolor: "bg-purple-800",
    color: "text-purple-800",
    description: "Análise de matrículas"
  },
  {
    nome: "Fichas Cadastradas",
    href: "/ficha-criadas",
    tipo: "Consulta",
    icon: FolderOpen,
    bgcolor: "bg-purple-800",
    color: "text-purple-800",
    description: "Visualizar fichas existentes"
  },
  {
    nome: "Validar Fichas",
    href: "/validar-ficha",
    tipo: "Validar",
    icon: FolderOpen,
    bgcolor: "bg-purple-800",
    color: "text-purple-800",
    description: "Validar fichas pendentes"
  },
<<<<<<< HEAD
=======
  {
    nome: "Ver fichas validadas",
    href: "/fichas-validadas",
    tipo: "Validar",
    icon: FileCheck,
    bgcolor: "bg-purple-800",
    color: "text-purple-800",
    description: "Ver as fichas que já estão validadas"
  },
>>>>>>> joaopaulo
];

function HomeFuncionalidades() {
  const [filtro, setFiltro] = useState("");
  const [tipo, setTipo] = useState("Todos");

  function manipularSelect(e) {
    setTipo(e.target.value);
  }

  function manipularInput(e) {
    setFiltro(e.target.value);
  }

  const funcionalidadesFiltradas = funcionalidades.filter(f =>
    f.nome.toLowerCase().includes(filtro.toLowerCase()) &&
    (tipo === "Todos" || f.tipo === tipo)
  );

  return (
    <>
    <Page />
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
            className="min-w-[150px] px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={tipo}
            onChange={manipularSelect}
          >
            <option value="Todos">Todos</option>
            <option value="Criação">Criação</option>
            <option value="Avaliação">Avaliação</option>
            <option value="Consulta">Consulta</option>
            <option value="Validar">Validar</option>
          </select>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {funcionalidadesFiltradas.map((funcionalidade, idx) => (
            <a key={idx} href={funcionalidade.href}>
              <div className="transition-all duration-200 hover:scale-[1.03] bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden">
                <div className={`${funcionalidade.bgcolor} h-2 w-full`} />
                <div className="p-5 flex flex-col items-center">
                  <funcionalidade.icon className={`w-10 h-10 mb-4 ${funcionalidade.color}`} />
                  <p className="text-center font-semibold text-gray-800 text-base">
                    {funcionalidade.nome}
                  </p>
                </div>
              </div>
            </a>
          ))}
          {funcionalidadesFiltradas.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Nenhuma funcionalidade encontrada.</p>
          )}
        </section>
      </main>
    </>
  );
}

export default HomeFuncionalidades;