const urlBase = 'http://localhost:4000/matriculas';

export async function consultarMatriculas(turmaId = null) {
  let url = urlBase;
  if (turmaId !== null) {
    url += `?turmaId=${turmaId}`;
  }

  const resposta = await fetch(url, { method: "GET" });
  const resultado = await resposta.json();
  return resultado;
}

export async function gravarMatricula(matricula) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(matricula),
  });
  return await resposta.json();
}

export async function alterarMatricula(id, matricula) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(matricula),
  });
  return await resposta.json();
}

export async function excluirMatricula(id) {
  const resposta = await fetch(`${urlBase}/${id}`, { method: "DELETE" });
  return await resposta.json();
}
