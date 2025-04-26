const urlBase = 'http://localhost:4000/turmas';

export async function gravarTurmas(turma) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(turma),
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function alterarTurmas(id, turma) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(turma),
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function excluirTurmas(turma) {
  const resposta = await fetch(`${urlBase}/${turma.id}`, { method: "DELETE" });
  return await resposta.json();
}

export async function consultarTurmas(termo) {
  let resposta;
  if (termo === undefined)
    resposta = await fetch(urlBase + "/", {
      method: "GET",
    });
  else
    resposta = await fetch(urlBase + "/" + termo, {
      method: "GET",
    });
  const resultado = await resposta.json();
  return resultado;
}
