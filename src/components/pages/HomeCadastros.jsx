import { useEffect, useState } from "react";
import Page from "../layouts/Page";

const todosTipos = ["Pessoas", "Infra", "Academico"];

const cadastros = [
    { nome: "Cadastro de Aluno", href: "/cadastros/aluno", tipo: "Pessoas" },
    { nome: "Cadastro de Profissional", href: "/cadastros/profissional", tipo: "Pessoas" },
    { nome: "Cadastro de Responsavel", href: "/cadastros/pessoa", tipo: "Pessoas" },
    { nome: "Cadastro de Serie", href: "/cadastros/serie", tipo: "Infra" }
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
            <main className="flex flex-col ">
                <section className="m-20 justify-evenly flex row">
                    <div className="w-3/6"><input style={{width:"100%"}} className="border-4 border-solid rounded-xl pl-4" placeholder="    Digite um filtro" type="text" id="filtroInput" value={filtro} onChange={manipularInput} /></div>
                    <div className="w-2/6 ">
                        <select className="border-4 border-solid rounded-xl" name="tipoSelect" id="tipoSelect" value={tipo} onChange={manipularSelect}>
                            <option value="todos">Todos</option>
                            <option value="Pessoas">Pessoas</option>
                            <option value="Infra">Infraestrutura</option>
                            <option value="Academico">Acadêmico</option>
                        </select>
                    </div>
                </section>
                <section className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 m-10">
                    {
                        cadastros.map((cadastro) => {
                            if (cadastro.nome.toLowerCase().includes(filtro.toLowerCase())) {
                                if (tipo == "todos" || cadastro.tipo === tipo)
                                    return (
                                        <div className="group relative border-4 border-double rounded-xl p-4 hover:bg-sky-700 ">
                                            <div className="mt-4 flex justify-between ">
                                                <div>
                                                    <h3 className="text-sm text-gray-700 hover:text-white">
                                                        <a href={cadastro.href}>
                                                            <span aria-hidden="true" className="absolute inset-0" />
                                                            {cadastro.nome}
                                                        </a>
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500 hover:text-white">Tipo: {cadastro.tipo}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                            }
                        })
                    }
                </section>
            </main>
        </>
    )
}