import React from 'react';
import { Hash, BookOpen } from 'lucide-react';
import imagemFundoPrefeitura from "./assets/imagemFundoPrefeitura.png";
import logoPrefeitura from "./assets/logoPrefeitura.png";

function App() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: url(${imagemFundoPrefeitura}) }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">
              Cadastro de Matéria
            </h2>
            <img 
              src={logoPrefeitura} 
              alt="Logo da Prefeitura" 
              className="h-24 w-auto"
            />
          </div>
          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="materia_id" 
                  className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                >
                  <Hash className="w-4 h-4" />
                  Identificação
                </label>
                <input 
                  type="number" 
                  name="materia_id" 
                  id="materia_id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Digite o ID"
                />
              </div>
              <div>
                <label 
                  htmlFor="materia_nome" 
                  className="flex items-center gap-2 text-sm font-medium text-white mb-1"
                >
                  <BookOpen className="w-4 h-4" />
                  Nome
                </label>
                <input 
                  type="text" 
                  name="materia_nome" 
                  id="materia_nome"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Digite o nome"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              Confirmar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;