import { useEffect, useState } from "react";
import Page from "../layouts/Page";
import { BookUser, Backpack, User, Shapes } from "lucide-react";


const cadastros = [
    { nome: "Cadastro de Aluno", href: "/cadastros/aluno", tipo: "Pessoas", icon: Backpack },
    { nome: "Cadastro de Profissional", href: "/cadastros/profissional", tipo: "Pessoas", icon: BookUser },
    { nome: "Cadastro de Responsável", href: "/cadastros/pessoa", tipo: "Pessoas", icon: User },
    { nome: "Cadastro de Serie", href: "/cadastros/serie", tipo: "Infra", icon: Shapes }
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
            setTipo("todos");
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
                                <option value="todos">Todos</option>
                                <option value="Pessoas">Pessoas</option>
                                <option value="Infra">Infraestrutura</option>
                                <option value="Academico">Acadêmico</option>
                            </select>
                        </div>
                    </section>
                    <section className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 " style={{ width: "75%" }}>
                        {
                            cadastros.map((cadastro) => {
                                if (cadastro.nome.toLowerCase().includes(filtro.toLowerCase())) {
                                    if (tipo == "todos" || cadastro.tipo === tipo)
                                        return (
                                            <a href={cadastro.href}>
                                                <div className="transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
                                                    <div className="bg-orange-500 h-2"></div>
                                                    <div className="p-6">
                                                        <cadastro.icon className="w-12 h-12 mx-auto mb-4 text-orange-500" />
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