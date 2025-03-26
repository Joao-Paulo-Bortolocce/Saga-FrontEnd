import { useState } from "react";
import Page from "../layouts/Page";
import CadastroPessoa from "./cadastros/CadastroPessoa";
import TabelaPessoa from "./tabelas/TabelaPessoa";

export default function HomePessoas(props) {
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
        estadoCivil: "",
        endereco: {
            rua: "",
            numero: "",
            complemento: "",
            cep: "",
            uf: "",
            cidade: ""
        }
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
                    setExibirTabela={setExibirTabela} 
                    setModoEdicao={setModoEdicao} 
                    modoEdicao={modoEdicao} 
                    pessoa={pessoa} 
                    setPessoa={setPessoa}
                />
            )}
        </>
    );
}
