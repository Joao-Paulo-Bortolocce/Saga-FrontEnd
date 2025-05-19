import { useState } from "react";
import Page from "../layouts/Page";
import CadastroFrequencia from "./cadastros/CadastroFrequencia";
import TabelaFrequencia from "./tabelas/TabelaFrequencia";

export default function HomeFrequencia(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [turma, setTurma] = useState();

    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-1/10">
                <Page />
            </div>
            <div className="h-9/10">
                {exibirTabela ? (
                    <TabelaFrequencia
                        setExibirTabela={setExibirTabela}
                        setTurma={setTurma}
                    />
                ) : (
                    <CadastroFrequencia
                        setExibirTabela={setExibirTabela}
                        turma={turma}
                    />
                )}
            </div>
        </div>

    );
}
