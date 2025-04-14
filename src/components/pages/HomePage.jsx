import Page from "../layouts/Page";
import logoPrefeitura from "../../assets/images/logoPrefeitura.png";
import imagemFundo from "../../assets/images/imagemFundoPrefeitura.png"; // mesma usada nos formulários

export default function HomePage() {
  const nomeUsuario = "USUARIO TESTE"; // Pode ser dinâmico depois

  return (
    <>
      <Page className="h-1/10"  style={{height:"10vh"}}/>
      <div
        className="bg-cover bg-black/70 z-0  flex items-center justify-center " 
        style={{height:"90vh"}}
      >
        {/* sobreposição escura */}


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
