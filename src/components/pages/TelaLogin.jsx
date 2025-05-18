import { useState, useContext } from "react";
import { consultarUsuario } from "../../service/serviceProfissional";
import toast, { Toaster } from "react-hot-toast";
import { ContextoUsuario } from "../../App";

export default function TelaLogin() {
  const { setUsuario } = useContext(ContextoUsuario); // <-- AQUI
  const [usuarioLogin, setUsuarioLogin] = useState({
    ra: "",
    senha: ""
  });

  function manipularMudanca(event) {
    const id = event.currentTarget.id;
    let valor = event.currentTarget.value;

    if (id === "ra") {
      if (valor.length === 0 || /^[0-9]+$/.test(valor)) {
        setUsuarioLogin({ ...usuarioLogin, [id]: valor });
      }
    } else {
      setUsuarioLogin({ ...usuarioLogin, [id]: valor });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const resultado = await consultarUsuario({
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
      } else {
        toast.error(resultado.mensagem, { duration: 3000 });
      }
    } catch (error) {
      console.error("Erro ao consultar usuário:", error);
      toast.error("Erro de conexão com o servidor.", { duration: 3000 });
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto mt-20 p-6 border border-gray-200 rounded-xl shadow bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="ra" className="block text-sm font-medium text-gray-700">
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
          <p className="mt-1 text-xs text-gray-500">
            Nunca compartilhe suas credenciais de acesso.
          </p>
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            onChange={manipularMudanca}
            value={usuarioLogin.senha}
            placeholder="Password"
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
  );
}
