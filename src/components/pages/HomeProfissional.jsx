import { useState } from "react";
import Page from "../layouts/Page";
import TabelaProfissional from "./tabelas/TabelaProfissional";
import CadastroProfissional from "./cadastros/CadastroProfissional";

export default function HomePessoas(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [profissional, setProfissional] = useState({
        profissional_ra: 0,
            profissional_tipo: 0,
            profissional_dataAdmissao: new Date().toISOString().substring(0, 10),
            profissional_graduacao: {
                id: 0,
            },
            profissional_pessoa: {
                cpf: "",
                nome: "",
            },
            profissional_usuario:"",
            profissional_senha:""
    });


    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-1/10">
                <Page />
            </div>
            <div className="h-9/10">
                {exibirTabela ? (
                    <TabelaProfissional
                        setExibirTabela={setExibirTabela}
                        setModoEdicao={setModoEdicao}
                        setProfissional={setProfissional}
                    />
                ) : (
                    <CadastroProfissional
                        setExibirTabela={setExibirTabela}
                        setModoEdicao={setModoEdicao}
                        modoEdicao={modoEdicao}
                        profissional={profissional}
                        setProfissional={setProfissional}
                        cadastrarPessoa={false}
                    />
                )}
            </div>
        </div>

    );
}
