import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import imagemFundoPrefeitura from "./assets/images/imagemFundoPrefeitura.png";

import TelaLogin from "./components/pages/TelaLogin.jsx";
import HomePage from "./components/pages/HomePage";
import HomeCadastros from "./components/pages/HomeCadastros";
import HomePessoas from "./components/pages/HomePessoas";
import HomeGraduacao from "./components/pages/HomeGraduacao.jsx"
import HomeNotificacao from "./components/pages/HomeNotificacao.jsx"
import HomeFrequencia from "./components/pages/HomeFrequencia.jsx"
import HomeAluno from "./components/pages/HomeAluno.jsx";
import HomeProfissional from "./components/pages/HomeProfissional.jsx";
import TabelaMateria from "./components/pages/tabelas/TabelaMateria.jsx";
import HomeMateria from "./components/pages/HomeMateria.jsx";
import HomeSeries from "./components/pages/HomeSeries.jsx";
import HomeMatricula from "./components/pages/HomeMatricula.jsx";
import HomeReunioes from "./components/pages/HomeReunioes.jsx";
import HomeSalas from "./components/pages/HomeSalas.jsx";
import HomePovoarTurma from "./components/pages/HomePovoarTurma.jsx";
import HomeTurmas from "./components/pages/HomeTurmas.jsx";
import HomeAnoLetivo from "./components/pages/HomeAnoLetivo.jsx";
import HomeFuncionalidades from "./components/pages/HomeFuncionalidades.jsx";
import FichaMontagem from "./components/pages/FichaMontagem.jsx";
import FichasCriadas from "./components/pages/FichasCriadas.jsx";
import HomeHabilidades from "./components/pages/HomeHabilidades.jsx";

import RotasControle from "./components/Rotas/RotasControle.jsx";


import toast, { Toaster } from "react-hot-toast";

export const ContextoUsuario = createContext();

function tokenExpirado(token) {
    if (!token) return true;

    const payload = token.split('.')[1];
    if (!payload) return true;

    try {
        const decoded = JSON.parse(atob(payload));
        if (!decoded.exp) return true;

        const agora = Math.floor(Date.now() / 1000);
        return decoded.exp < agora;
    } catch (e) {
        return true;
    }
}

export default function App() {
    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");

        const usuarioLocal = salvo
            ? JSON.parse(salvo)
            : { id: 0, username: "", senha: "", tipo: "", logado: false };

        if (!token || tokenExpirado(token)) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            return { id: 0, username: "", senha: "", tipo: "", logado: false };
        }

        return usuarioLocal;
    });

    useEffect(() => {
        localStorage.setItem("usuario", JSON.stringify(usuario));
    }, [usuario]);

    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem("token");
            if (tokenExpirado(token) && usuario.logado) {
                toast.error("Sua conexão expirou, faça login novamente!");

            }
        }, 10000); // verifica a cada 1 minuto

        return () => clearInterval(interval);
    }, []);

    if (!usuario.logado) {
        return (
            <ContextoUsuario.Provider value={{ usuario, setUsuario }}>
                <TelaLogin />
                <Toaster position="top-center" />
            </ContextoUsuario.Provider>
        );
    }

    return (
        <Provider store={store}>
            <ContextoUsuario.Provider value={{ usuario, setUsuario }}>
                <div
                    className="App min-h-screen"
                    style={{
                        backgroundImage: `url(${imagemFundoPrefeitura})`,
                        backgroundSize: "cover",
                    }}
                >
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/cadastros" element={<RotasControle permissao={[1, 3]}><HomeCadastros /></RotasControle>} />
                            <Route path="/cadastros/pessoa" element={<RotasControle permissao={[1, 3]}><HomePessoas /></RotasControle>} />
                            <Route path="/cadastros/aluno" element={<RotasControle permissao={[1, 3]}><HomeAluno /></RotasControle>} />
                            <Route path="/cadastros/profissional" element={<RotasControle permissao={[1, 3]}><HomeProfissional /></RotasControle>} />
                            <Route path="/cadastros/materia" element={<RotasControle permissao={[1, 3]}><TabelaMateria /></RotasControle>} />
                            <Route path="/cadastros/materia/cad-materia" element={<RotasControle permissao={[1, 3]}><HomeMateria /></RotasControle>} />
                            <Route path="/cadastros/serie" element={<RotasControle permissao={[1, 3]}><HomeSeries /></RotasControle>} />
                            <Route path="/cadastros/matricula" element={<RotasControle permissao={[1, 3]}><HomeMatricula /></RotasControle>} />
                            <Route path="cadastros/habilidade" element={<RotasControle permissao={[1,3]}><HomeHabilidades /></RotasControle>} />
                            <Route path="/cadastros/sala" element={<RotasControle permissao={[1, 3]}><HomeSalas /></RotasControle>} />
                            <Route path="/cadastros/reuniao" element={<RotasControle permissao={[1, 3]}><HomeReunioes /></RotasControle>} />
                            <Route path="/cadastros/povoarTurma" element={<RotasControle permissao={[1,3]}><HomePovoarTurma /></RotasControle>} />
                            <Route path="/cadastros/turma" element={<RotasControle permissao={[1,3]}><HomeTurmas /></RotasControle>} />
                            <Route path="/cadastros/graduacao" element={<RotasControle permissao={[1, 3]}><HomeGraduacao /></RotasControle>} />
                            <Route path="/cadastros/anoletivo" element={<RotasControle permissao={[1, 3]}><HomeAnoLetivo /></RotasControle>} />
                            <Route path="/funcionalidades" element={<RotasControle permissao={[1, 3]}><HomeFuncionalidades /></RotasControle>} />
                            <Route path="/ficha-montagem" element={<RotasControle permissao={[1,3]}><FichaMontagem /> </RotasControle>} />
                            <Route path="/ficha-criadas" element={<RotasControle permissao={[1,3]}><FichasCriadas /></RotasControle>} />
                            <Route path="/chamada" element={<RotasControle permissao={[2]}><HomeFrequencia /></RotasControle>} />
                            <Route path="/notificacao" element={<RotasControle permissao={[1]}><HomeNotificacao /></RotasControle>} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster position="top-center" />
                </div>
            </ContextoUsuario.Provider>
        </Provider>
    );
}