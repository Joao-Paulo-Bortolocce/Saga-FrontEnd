import Page from "../layouts/Page";
import logoPrefeitura from "../../assets/images/logoPrefeitura.png";
import imagemFundo from "../../assets/images/imagemFundoPrefeitura.png"; // mesma usada nos formulários

export default function HomePage() {
  const nomeUsuario = "USUARIO TESTE"; // Pode ser dinâmico depois

  return (
    <>
      <Page className="overflow-hidden"/>
      <div
        className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${imagemFundo})` }}
      >
        {/* sobreposição escura */}
        <div className="absolute inset-0 bg-black/70 z-0" />

        <div className="relative z-10 text-center">
          <img
            src={logoPrefeitura}
            alt="Logo Prefeitura"
            className="h-44 mx-auto mb-10"
          />
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            Bem-Vindo <span className="uppercase">{nomeUsuario}</span>
          </h1>
        </div>
      </div>
    </>
  );
}
