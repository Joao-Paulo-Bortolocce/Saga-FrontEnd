import { useContext } from "react";
import Page from "../layouts/Page";
import logoPrefeitura from "../../assets/images/logoPrefeitura.png";
import imagemFundo from "../../assets/images/imagemFundoPrefeitura.png";
import { ContextoUsuario } from "../../App";

export default function HomePage() {
  const { usuario } = useContext(ContextoUsuario);
  const nomeUsuario = usuario?.username || "Usuário";

  return (
    <>
      <Page className="h-[10vh]" />

      <div
        className="relative h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${imagemFundo})` }}
      >
        {/* Camada escura sobre a imagem de fundo */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Conteúdo centralizado */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <img
            src={logoPrefeitura}
            alt="Logo Prefeitura"
            className="h-40 mb-8 drop-shadow-lg"
          />
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-sm">
            Bem-vindo, <span className="uppercase text-indigo-300">{nomeUsuario}</span>
          </h1>
          <p className="mt-4 text-sm md:text-base max-w-md text-gray-200">
            Este é o portal de gestão educacional. Use o menu acima para navegar pelas funcionalidades do sistema.
          </p>
        </div>
      </div>
    </>
  );
}
