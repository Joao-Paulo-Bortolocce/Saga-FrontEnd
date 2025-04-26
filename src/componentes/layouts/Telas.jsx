import logoPrefeitura from "../assets/logoPrefeitura.png"

export default function Telas({ children }) {
    return (
      <div className="min-h-screen bg-zinc-800 text-white">
        <nav className="bg-gray-500 p-4">
          <img src={logoPrefeitura} alt="logoPrefeitura" className="h-24 w-auto"/>
        </nav>
        <main className="p-10">
          <h2 className="text-4xl font-bold text-center mb-6">Cadastro Salas</h2>
          {children}
        </main>
      </div>
    );
  }