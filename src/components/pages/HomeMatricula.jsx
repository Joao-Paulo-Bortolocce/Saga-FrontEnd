import { useState } from "react";
import Page from "../layouts/Page";
import CadastroMatricula from "./cadastros/CadastroMatricula";
import TabelaMatricula from "./tabelas/TabelaMatricula";

export default function HomeMatricula(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [matricula, setMatricula] = useState({
        ra: 0,
        anoLetivo_id: 0,
        serie_id: 0
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
