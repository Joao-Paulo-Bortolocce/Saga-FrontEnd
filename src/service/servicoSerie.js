const urlBase = 'http://localhost:8080/serie';

export async function gravarSerie(serie) {
  const resposta = await fetch(`${urlBase}/gravar`, {
    method: "POST",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(serie),
  });
  return await resposta.json();
}

export async function alterarSerie(id, serie) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(serie),
  });
  return await resposta.json();
}

export async function excluirSerie(serie) {
  const resposta = await fetch(`${urlBase}/${serie.serieId}`, { method: "DELETE" });
  return await resposta.json();
}

export async function consultarSerie(termo = "") {
  const url = termo.trim()
    ? `${urlBase}/buscar/${termo}`
    : `${urlBase}/buscarTodos`;

  const resposta = await fetch(url);
  const resultado = await resposta.json();
  return resultado.series || [];
}
  
export async function buscarSeries() {
  const resposta = await fetch("http://localhost:8080/serie/buscarTodos");
  return await resposta.json();
}
