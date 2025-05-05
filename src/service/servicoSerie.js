const urlBase = 'http://localhost:4000/serie';

export async function gravarSerie(serie) {
  const resposta = await fetch(urlBase, {
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
  const resposta = await fetch(`${urlBase}/${serie.id}`, { method: "DELETE" });
  return await resposta.json();
}

export async function consultarSerie(termo = "") {
    const resposta = await fetch(`${urlBase}/${termo}`);
    const resultado = await resposta.json();
    return resultado;
}
  
export async function buscarSeries() {
  const resposta = await fetch("http://localhost:8080/serie/buscarTodos");
  return await resposta.json();
}