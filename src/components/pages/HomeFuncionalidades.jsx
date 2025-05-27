import { BookText } from "lucide-react";
import Page from "../layouts/Page";
import { useNavigate } from "react-router-dom";

export default function HomeFuncionalidades() {
  const navigate = useNavigate();

  return (
    <>
      <Page />
      <main>
        <section style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <section className="justify-evenly flex row" style={{ width: "75%" }}>
            <button
              onClick={() => navigate("/ficha-montagem")}
              className="max-h-[150px] transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div>
                <div className="bg-yellow-600 h-2"></div>
                <div className="p-6">
                  <BookText className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                  <p className="text-center font-semibold text-gray-800 text-lg">
                    Montar Ficha
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate("/ficha-criadas")}
              className="max-h-[150px] transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div>
                <div className="bg-yellow-600 h-2"></div>
                <div className="p-6">
                  <BookText className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                  <p className="text-center font-semibold text-gray-800 text-lg">
                    Fichas Cadastradas
                  </p>
                </div>
              </div>
            </button>
            <div className="w-1/5"></div>
          </section>
        </section>
      </main>
    </>
  );
}
