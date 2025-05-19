function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`
  };
  if (contentType) headers["Content-type"] = "application/json";
  return headers;
}

export async function buscarAnosLetivos() {
    const resposta = await fetch("http://localhost:8080/anoletivo/buscarTodos",{
      headers: obterHeaders(),
    });
    return await resposta.json();
}