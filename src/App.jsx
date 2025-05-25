import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import imagemFundoPrefeitura from "./assets/images/imagemFundoPrefeitura.png";

import TelaLogin from "./components/pages/TelaLogin.jsx";
import HomePage from "./components/pages/HomePage";
import HomeCadastros from "./components/pages/HomeCadastros";
import HomePessoas from "./components/pages/HomePessoas";
import HomeAluno from "./components/pages/HomeAluno.jsx";
import HomeProfissional from "./components/pages/HomeProfissional.jsx";
import TabelaMateria from "./components/pages/tabelas/TabelaMateria.jsx";
import HomeMateria from "./components/pages/HomeMateria.jsx";
import HomeSeries from "./components/pages/HomeSeries.jsx";
import HomeMatricula from "./components/pages/HomeMatricula.jsx";
import HomeReunioes from "./components/pages/HomeReunioes.jsx";
import HomeSalas from "./components/pages/HomeSalas.jsx";
import TabelaTurmasChamada from "./components/pages/tabelas/TabelaTurmasChamada.jsx";
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
                            <Route path="/cadastros/sala" element={<RotasControle permissao={[1, 3]}><HomeSalas /></RotasControle>} />
                            <Route path="/cadastros/reuniao" element={<RotasControle permissao={[1, 3]}><HomeReunioes /></RotasControle>} />
                            <Route path="/cadastros/chamada" element={<RotasControle permissao={[1, 3]}><TabelaTurmasChamada /></RotasControle>} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster position="top-center" />
                </div>
            </ContextoUsuario.Provider>
        </Provider>
    );
}