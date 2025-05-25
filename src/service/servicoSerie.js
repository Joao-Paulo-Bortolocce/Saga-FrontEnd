const urlBase = 'http://localhost:8080/serie';

function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    'Authorization': `${token}`
  };
  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function gravarSerie(serie) {
  const resposta = await fetch(`${urlBase}/gravar`, {
    method: "POST",
    headers: obterHeaders(),
    body: JSON.stringify(serie),
  });
  return await resposta.json();
}

export async function alterarSerie(id, serie) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: obterHeaders(),
    body: JSON.stringify(serie),
  });
  return await resposta.json();
}

export async function excluirSerie(serie) {
  const resposta = await fetch(`${urlBase}/${serie.serieId}`, {
    method: "DELETE",
    headers: obterHeaders(false)
  });
  return await resposta.json();
}

export async function consultarSerie(termo = "") {
  const url = termo.trim()
    ? `${urlBase}/buscar/${termo}`
    : `${urlBase}/buscarTodos`;

  const resposta = await fetch(url, {
    method: "GET",
    headers: obterHeaders(false)
  });
  const resultado = await resposta.json();
  return resultado.series || [];
}
  
export async function buscarSeries() {
  const resposta = await fetch(`${urlBase}/buscarTodos`, {
    method: "GET",
    headers: obterHeaders(false)
  });
  return await resposta.json();
}