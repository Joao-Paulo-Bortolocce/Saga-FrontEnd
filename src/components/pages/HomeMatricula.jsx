import { useState } from "react";
import Page from "../layouts/Page";
import CadastroMatricula from "./cadastros/CadastroMatricula";
import TabelaMatricula from "./tabelas/TabelaMatricula";

export default function HomeMatricula(props) {
    const [exibirTabela, setExibirTabela] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [matricula, setMatricula] = useState({
        id: 0,
        ra: "",
        aprovado: 0,
        idMatricula: 0,
        Turma_letra: "",
        Turma_Serie_id: 0,
        Turma_AnoLetivo_id: 0,
        Aluno_RA: 0,
        AnoLetivo_id: 0,
        Serie_id: 0
    });


    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-1/10">
                <Page />
            </div>
            <div className="h-9/10">
                {exibirTabela ? (
                    <TabelaMatricula
                        setExibirTabela={setExibirTabela}
                        setModoEdicao={setModoEdicao}
                        setMatricula={setMatricula}
                    />
                ) : (
                    <CadastroMatricula
                        setExibirTabela={setExibirTabela}
                        setModoEdicao={setModoEdicao}
                        modoEdicao={modoEdicao}
                        matricula={matricula}
                        setMatricula={setMatricula}
                    />
                )}
            </div>
        </div>

    );
}
