import Page from "../layouts/Page";
import TabelaNotificacao from "./tabelas/TabelaNotificacao";

export default function HomeNotificacao(props) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-1/10">
                <Page />
            </div>
            <div className="h-9/10">
                <TabelaNotificacao/>
            </div>
        </div>

    );
}
