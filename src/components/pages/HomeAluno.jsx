import { useState } from "react";
import Page from "../layouts/Page";
import CadastroAluno from "./cadastros/CadastroAluno";
import TabelaAluno from "./tabelas/TabelaAluno";
import CadastroPessoa from "./cadastros/CadastroPessoa";

export default function HomeAluno(props) {
    const [cadastrarPessoa, setCadastrarPessoas] = useState(false);
    const [exibirTabela, setExibirTabela] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [aluno, setAluno] = useState({
        ra: 0,
        restricaoMedica: "",
        pessoa: {
            cpf: "",
            nome: "",
            dataNascimento:""
        }
    });
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
        <div className="min-h-screen flex flex-col">
            <div className="h-1/10">
                <Page />
            </div>
            <div className="h-9/10">
                {
                    cadastrarPessoa ? (<CadastroPessoa  setExibirTabela={setExibirTabela}
                        setModoEdicao={setModoEdicao}
                        modoEdicao={modoEdicao}
                        pessoa={pessoa}
                        setPessoa={setPessoa}
                        cadastrarPessoa={cadastrarPessoa}
                        setCadastrarPessoas={setCadastrarPessoas}
                        setAluno={setAluno}/>
                    ) :
                       ( exibirTabela ? (
                            <TabelaAluno
                                setExibirTabela={setExibirTabela}
                                setModoEdicao={setModoEdicao}
                                setAluno={setAluno}
                            />
                        ) : (
                            <CadastroAluno
                                setExibirTabela={setExibirTabela}
                                setModoEdicao={setModoEdicao}
                                modoEdicao={modoEdicao}
                                aluno={aluno}
                                setAluno={setAluno}
                                setCadastrarPessoas={setCadastrarPessoas}
                                setPessoa={setPessoa}
                            />
                        ))
                }
            </div>
        </div>

    );
}
