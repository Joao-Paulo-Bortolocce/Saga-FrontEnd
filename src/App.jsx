import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { createContext } from "react";
import store from "./redux/store.js";
import imagemFundoPrefeitura from "./assets/images/imagemFundoPrefeitura.png";

// Páginas
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

export const ContextoUsuario = createContext();

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo
      ? JSON.parse(salvo)
      : { id: 0, username: "", senha: "", tipo: "", logado: false };
  });

  // Atualiza o localStorage sempre que o estado de usuario mudar
  useEffect(() => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }, [usuario]);

  if (!usuario.logado) {
    return (
      <ContextoUsuario.Provider value={{ usuario, setUsuario }}>
        <TelaLogin />
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
              <Route path="/cadastros" element={<HomeCadastros />} />
              <Route path="/cadastros/pessoa" element={<HomePessoas />} />
              <Route path="/cadastros/aluno" element={<HomeAluno />} />
              <Route path="/cadastros/profissional" element={<HomeProfissional />} />
              <Route path="/cadastros/materia" element={<TabelaMateria />} />
              <Route path="/cadastros/materia/cad-materia" element={<HomeMateria />} />
              <Route path="/cadastros/serie" element={<HomeSeries />} />
              <Route path="/cadastros/matricula" element={<HomeMatricula />} />
              <Route path="/cadastros/sala" element={<HomeSalas />} />
              <Route path="/cadastros/reuniao" element={<HomeReunioes />} />
              <Route path="/cadastros/chamada" element={<TabelaTurmasChamada />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ContextoUsuario.Provider>
    </Provider>
  );
}
