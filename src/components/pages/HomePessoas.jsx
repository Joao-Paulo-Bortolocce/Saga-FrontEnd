import { useState } from "react";
import Page from "../layouts/Page";
import CadastroPessoa from "./cadastros/CadastroPessoa";
import TabelaPessoa from "./tabelas/TabelaPessoa";

export default function HomePessoas() {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [pessoa, setPessoa] = useState({
        cpf: "",
        rg: "",
        nome: "",
        dataNascimento: "",
        sexo: "",
        locNascimento: "",
        estadoNascimento: "",
        enderecoId: 1,
        estadoCivil: ""
    });

    return (
        <>
            <Page />
            {exibirTabela ? (
                <TabelaPessoa 
                    setExibirTabela={setExibirTabela} 
                    setModoEdicao={setModoEdicao} 
                    setPessoa={setPessoa} 
                />
            ) : (
                <CadastroPessoa 
                    setModoEdicao={setModoEdicao} 
                    modoEdicao={modoEdicao} 
                    pessoa={pessoa} 
                    setPessoa={setPessoa}
                />
            )}
        </>
    );
}
