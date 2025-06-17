import { useState } from "react";
import Page from "../layouts/Page";
import CadastroGraduacao from "./cadastros/CadastroGraduacao";
import TabelaGraduacao from "./tabelas/TabelaGraduacao";

export default function HomeGraduacao(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [graduacao, setGraduacao] = useState({
        id: 0,
        descricao: ""
    });


    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-1/10">
                <Page />
            </div>
            <div className="h-9/10">
                {exibirTabela ? (
                    <TabelaGraduacao
                        setExibirTabela={setExibirTabela}
                        setModoEdicao={setModoEdicao}
                        setGraduacao={setGraduacao}
                    />
                ) : (
                    <CadastroGraduacao
                        setExibirTabela={setExibirTabela}
                        setModoEdicao={setModoEdicao}
                        modoEdicao={modoEdicao}
                        graduacao={graduacao}
                        setGraduacao={setGraduacao}
                    />
                )}
            </div>
        </div>

    );
}
