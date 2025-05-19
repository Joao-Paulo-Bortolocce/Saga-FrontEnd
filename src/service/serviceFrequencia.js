function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`
  };
  if (contentType) headers["Content-type"] = "application/json";
  return headers;
}

const urlBase = "http://localhost:8080/frequencia";

export async function gravarFrequencia(dados) {
    const resposta = await fetch(urlBase, {
        "method": "POST",
        headers: obterHeaders(),
        "body": JSON.stringify(dados)
    })
    const resultado = await resposta.json();
    return await resultado;
}