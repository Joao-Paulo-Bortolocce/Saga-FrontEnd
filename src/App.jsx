import HomeCadastros from "./components/pages/HomeCadastros";
import HomePage from "./components/pages/HomePage";
import HomePessoas from "./components/pages/HomePessoas";
import MateriaPage from "./components/pages/cadastros/MateriaPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import imagemFundoPrefeitura from "./assets/images/imagemFundoPrefeitura.png";
import HomeSeries from "./components/pages/HomeSeries.jsx";
import HomeMatricula from "./components/pages/HomeMatricula.jsx";
import HomeReunioes from "./components/pages/HomeReunioes.jsx"
import HomeSalas from "./components/pages/HomeSalas.jsx"

export default function App() {
  return (
    <div className="App min-h-screen" style={{ backgroundImage: `url(${imagemFundoPrefeitura})` , backgroundSize:"cover"}}>
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/cadastros/pessoa" element={<HomePessoas />} /> 
          <Route path="/cadastros/materia" element={<MateriaPage />} />
          <Route path="/cadastros/serie" element={<HomeSeries />} />
          <Route path="/cadastros/matricula" element={<HomeMatricula />} />
          <Route path="/cadastros/sala" element={<HomeSalas />}/>
          <Route path="/cadastros/reuniao" element={<HomeReunioes />} />
          <Route path="/cadastros" element={<HomeCadastros />} />
          <Route path="/" element={<HomePage />} />
        </Routes> {/* A ordem das rotas é importante, por isso o Tela404 vem por ultimo com o * que significa que qualquer rota chama ele, e então deve ser o ultimo se não será chamado sempre*/}
      </BrowserRouter>
      </Provider>
    </div>
  );
}