import { useEffect, useState } from "react";
import Page from "../layouts/Page";
import {
  BookUser, Backpack, User, Shapes, Calculator,
  CalendarClock, SquarePen, Users, Calendar,
  GraduationCap, Dumbbell, DoorClosed
} from "lucide-react";

const cadastros = [
  { nome: "Cadastro de Aluno", href: "/cadastros/aluno", tipo: "Pessoas", icon: Backpack, bgcolor: "bg-orange-500", color: "text-orange-500" },
  { nome: "Cadastro de Profissional", href: "/cadastros/profissional", tipo: "Pessoas", icon: BookUser, bgcolor: "bg-orange-500", color: "text-orange-500" },
  { nome: "Cadastro de Pessoa", href: "/cadastros/pessoa", tipo: "Pessoas", icon: User, bgcolor: "bg-orange-500", color: "text-orange-500" },
  { nome: "Cadastro de Matricula", href: "/cadastros/matricula", tipo: "Pessoas", icon: SquarePen, bgcolor: "bg-orange-500", color: "text-orange-500" },
  { nome: "Cadastro de Serie", href: "/cadastros/serie", tipo: "Infraestrutura", icon: Shapes, bgcolor: "bg-red-500", color: "text-red-500" },
  { nome: "Cadastro de Turmas", href: "/cadastros/turma", tipo: "Infraestrutura", icon: Users, bgcolor: "bg-red-500", color: "text-red-500" },
  { nome: "Cadastro de Salas", href: "/cadastros/sala", tipo: "Infraestrutura", icon: DoorClosed, bgcolor: "bg-red-500", color: "text-red-500" },
  { nome: "Cadastro de Ano letivo", href: "/cadastros/anoLetivo", tipo: "Infraestrutura", icon: Calendar, bgcolor: "bg-red-500", color: "text-red-500" },
  { nome: "Cadastro de Graduação", href: "/cadastros/graduacao", tipo: "Infraestrutura", icon: GraduationCap, bgcolor: "bg-red-500", color: "text-red-500" },
  { nome: "Agendar Reunião de Pais", href: "/cadastros/reuniao", tipo: "Infra", icon: Shapes, bgcolor: "bg-red-500", color: "text-red-500" },
  { nome: "Cadastro de Matérias", href: "/cadastros/materia", tipo: "Acadêmico", icon: Calculator, bgcolor: "bg-blue-500", color: "text-blue-500" },
  { nome: "Cadastro de Habilidades", href: "/cadastros/habilidade", tipo: "Acadêmico", icon: Dumbbell, bgcolor: "bg-blue-500", color: "text-blue-500" },
  { nome: "Agendar reunião de pais", href: "/cadastros/reuniao", tipo: "Acadêmico", icon: CalendarClock, bgcolor: "bg-blue-500", color: "text-blue-500" },
];

export default function HomeCadastros() {
  const [filtro, setFiltro] = useState("");
  const [tipo, setTipo] = useState("Todos");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tipoParam = params.get("tipo");
    if (tipoParam) setTipo(tipoParam);
  }, []);

  function manipularSelect(e) {
    setTipo(e.target.value);
  }

  function manipularInput(e) {
    setFiltro(e.target.value);
  }

  const cadastrosFiltrados = cadastros.filter(c =>
    c.nome.toLowerCase().includes(filtro.toLowerCase()) &&
    (tipo === "Todos" || c.tipo === tipo)
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
            <option value="Pessoas">Pessoas</option>
            <option value="Infraestrutura">Infraestrutura</option>
            <option value="Acadêmico">Acadêmico</option>
          </select>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {cadastrosFiltrados.map((cadastro, idx) => (
            <a key={idx} href={cadastro.href}>
              <div className="transition-all duration-200 hover:scale-[1.03] bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden">
                <div className={`${cadastro.bgcolor} h-2 w-full`} />
                <div className="p-5 flex flex-col items-center">
                  <cadastro.icon className={`w-10 h-10 mb-4 ${cadastro.color}`} />
                  <p className="text-center font-semibold text-gray-800 text-base">
                    {cadastro.nome}
                  </p>
                </div>
              </div>
            </a>
          ))}
          {cadastrosFiltrados.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Nenhum cadastro encontrado.</p>
          )}
        </section>
      </main>
    </>
  );
}
