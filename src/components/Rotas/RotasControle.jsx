import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { ContextoUsuario } from "../../App";

export default function RotasControle({ permissao, children }) {
  const { usuario } = useContext(ContextoUsuario);
  const temPermissao = permissao.includes(usuario.tipo);

  return usuario.logado && temPermissao ? (
    children
  ) : (
    <div>
      {alert("Você não tem permissão para acessar essa rota")}
      <Navigate to="/" replace />
    </div>
  );
}
