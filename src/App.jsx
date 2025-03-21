import HomePage from "./components/pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./redux/store.js";

export default function App() {
    return (
      <div className="App">
        {/* <Provider store={store}> */}
            <BrowserRouter>
              <Routes>                
                <Route path="/" element={<HomePage />} />
              </Routes> {/* A ordem das rotas é importante, por isso o Tela404 vem por ultimo com o * que significa que qualquer rota chama ele, e então deve ser o ultimo se não será chamado sempre*/}
            </BrowserRouter>
        {/* </Provider> */}
      </div>
    );
}