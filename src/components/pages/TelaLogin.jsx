import { useState, useContext } from "react";
import { logarUsuario } from "../../service/serviceProfissional";
import toast, { Toaster } from "react-hot-toast";
import { ContextoUsuario } from "../../App";
import imagemFundoPrefeitura from "../../assets/images/imagemFundoPrefeitura.png";
import logoPrefeitura from "../../assets/images/logoPrefeitura.png";

export default function TelaLogin() {
  const { setUsuario } = useContext(ContextoUsuario);
  const [usuarioLogin, setUsuarioLogin] = useState({
    ra: "",
    senha: ""
  });
  

  function manipularMudanca(event) {
    const id = event.currentTarget.id;
    let valor = event.currentTarget.value;

    if (id === "ra") {
      if (valor.length === 0 || !isNaN(valor)) {
        setUsuarioLogin({ ...usuarioLogin, [id]: valor });
      }
    } else {
      setUsuarioLogin({ ...usuarioLogin, [id]: valor });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (usuarioLogin.ra === "")
      toast.error("Informe um Ra para realizar o login", { duration: 3000 });
    else if (usuarioLogin.senha === "")
      toast.error("Informe uma senha para realizar o login", { duration: 3000 });
    else {
      try {
        const resultado = await logarUsuario({
          ra: usuarioLogin.ra,
          senha: usuarioLogin.senha
        });

        if (resultado.status) {
          setUsuario({
            id: resultado.usuario.profissional_ra,
            username: resultado.usuario.profissional_usuario,
            senha: resultado.usuario.profissional_senha,
            tipo: resultado.usuario.profissional_tipo,
            logado: true
          });
          localStorage.setItem("token", resultado.token);
        } else {
          toast.error(resultado.mensagem, { duration: 3000 });
        }
      } catch (error) {
        console.error("Erro ao consultar usuário:", error);
        toast.error("Erro de conexão com o servidor.", { duration: 3000 });
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${imagemFundoPrefeitura})`
      }}
    >
      <div className="w-full max-w-sm bg-white bg-opacity-90 p-6 rounded-xl shadow-md backdrop-blur-md text-center">
        {/* Logo e mensagem de boas-vindas */}
        <img
          src={logoPrefeitura}
          alt="Logo da Prefeitura"
          className="mx-auto w-28 h-auto mb-4"
        />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
        <p className="text-sm text-gray-600 mb-6">Faça login para continuar</p>

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ra" className="block text-sm font-semibold text-gray-800">
              Usuário
            </label>
            <input
              type="text"
              id="ra"
              name="ra"
              onChange={manipularMudanca}
              value={usuarioLogin.ra}
              placeholder="Informe o usuário"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-600">
              Nunca compartilhe suas credenciais de acesso.
            </p>
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-semibold text-gray-800">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              onChange={manipularMudanca}
              value={usuarioLogin.senha}
              placeholder="Senha"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
          >
            Login
          </button>
        </form>
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
