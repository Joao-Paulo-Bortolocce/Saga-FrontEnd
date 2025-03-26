const urlBase = 'http://localhost:4000/salas';

export async function gravarSalas(salas) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(salas),
  });
  return await resposta.json();
}

export async function alterarSalas(id, salas) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(salas),
  });
  return await resposta.json();
}

export async function excluirSalas(salas) {
  const resposta = await fetch(`${urlBase}/${salas.id}`, { method: "DELETE" });
  return await resposta.json();
}

export async function consultarSalas(termo = "") {
    const resposta = await fetch(`${urlBase}/${termo}`);
    const resultado = await resposta.json();
    return resultado;
}
  