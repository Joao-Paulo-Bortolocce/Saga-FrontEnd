import { useEffect, useState } from "react";
import Page from "../layouts/Page";
import { BookUser, Backpack, User, Shapes,Calculator,  CalendarClock,SquarePen , Users, Calendar, GraduationCap,Dumbbell,DoorClosed} from "lucide-react";



const cadastros = [
    { nome: "Cadastro de Aluno", href: "/cadastros/aluno", tipo: "Pessoas", icon: Backpack, bgcolor:"bg-orange-500", color:"text-orange-500" },
    { nome: "Cadastro de Profissional", href: "/cadastros/profissional", tipo: "Pessoas", icon: BookUser, bgcolor:"bg-orange-500", color:"text-orange-500" },
    { nome: "Cadastro de Pessoa", href: "/cadastros/pessoa", tipo: "Pessoas", icon: User, bgcolor:"bg-orange-500", color:"text-orange-500"},
    { nome: "Cadastro de Matricula", href: "/cadastros/matricula", tipo: "Pessoas", icon: SquarePen, bgcolor:"bg-orange-500", color:"text-orange-500"},
    { nome: "Cadastro de Serie", href: "/cadastros/serie", tipo: "Infraestrutura", icon: Shapes, bgcolor:"bg-red-500", color:"text-red-500" },
    { nome: "Cadastro de Turmas", href: "/cadastros/turma", tipo: "Infraestrutura", icon: Users, bgcolor:"bg-red-500", color:"text-red-500"  },
    { nome: "Cadastro de Salas", href: "/cadastros/sala", tipo: "Infraestrutura", icon: DoorClosed, bgcolor:"bg-red-500", color:"text-red-500"  },
    { nome: "Cadastro de Ano letivo", href: "/cadastros/anoLetivo", tipo: "Infraestrutura", icon: Calendar, bgcolor:"bg-red-500", color:"text-red-500"  },
    { nome: "Cadastro de Graduação", href: "/cadastros/graduacao", tipo: "Infraestrutura", icon: GraduationCap, bgcolor:"bg-red-500", color:"text-red-500"  },
    { nome: "Cadastro de Matérias", href: "/cadastros/materia", tipo: "Acadêmico", icon: Calculator, bgcolor:"bg-blue-500", color:"text-blue-500"  },
    { nome: "Cadastro de Habilidades", href: "/cadastros/habilidade", tipo: "Acadêmico", icon: Dumbbell, bgcolor:"bg-blue-500", color:"text-blue-500"  },
    { nome: "Agendar reunião de pais", href: "/cadastros/reuniao", tipo: "Acadêmico", icon: CalendarClock, bgcolor:"bg-blue-500", color:"text-blue-500"  }
]

export default function HomeCadastros(props) {

    const [filtro, setFiltro] = useState("");
    const [tipo, setTipo] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params != null) {
            setTipo(params.get("tipo"));
        }
        else {
            setTipo("Todos");
        }
    }, [])


    useEffect(() => {

    }, [filtro])


    function manipularSelect(event) {
        const tipoSelect = event.currentTarget.value;
        setTipo(tipoSelect);
    }

    function manipularInput(event) {
        const filtroInput = event.currentTarget.value;
        setFiltro(filtroInput);
    }

    return (
        <>
            <Page />
            <main >
                <section style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <section className=" justify-evenly flex row" style={{ width: "75%" }}>
                        <div className="w-3/5"><input style={{ width: "100%" }} className="border-4 border-solid rounded-xl pl-4" placeholder="    Digite um filtro" type="text" id="filtroInput" value={filtro} onChange={manipularInput} /></div>
                        <div className="w-1/5 ">
                            <select className="border-4 border-solid rounded-xl" name="tipoSelect" id="tipoSelect" value={tipo} onChange={manipularSelect}>
                                <option value="Todos">Todos</option>
                                <option value="Pessoas">Pessoas</option>
                                <option value="Infraestrutura">Infraestrutura</option>
                                <option value="Acadêmico">Acadêmico</option>
                            </select>
                        </div>
                    </section>
                    <section className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 " style={{ width: "75%" }}>
                        {
                            cadastros.map((cadastro) => {
                                if (cadastro.nome.toLowerCase().includes(filtro.toLowerCase())) {
                                    if (tipo == "Todos" || cadastro.tipo === tipo)
                                        return (
                                            <a href={cadastro.href}>
                                                <div className="max-h-[150px] transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
                                                    <div className={`${cadastro.bgcolor} h-2`}></div>
                                                    <div className="p-6">
                                                        <cadastro.icon className={`w-12 h-12 mx-auto mb-4 ${cadastro.color}`} />
                                                        <p className="text-center font-semibold text-gray-800 text-lg">
                                                            {cadastro.nome}
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                }
                            })
                        }
                    </section>
                </section>
            </main>
        </>
    )
}