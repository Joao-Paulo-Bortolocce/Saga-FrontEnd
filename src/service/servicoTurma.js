const urlBase = 'http://localhost:8080/turma';

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

export async function gravarTurmas(turma) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: obterHeaders(),
    body: JSON.stringify(turma),
  });
  return await resposta.json();
}

export async function alterarTurmas(id, turma) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: obterHeaders(),
    body: JSON.stringify(turma),
  });
  return await resposta.json();
}

export async function excluirTurmas(turma) {
  const resposta = await fetch(`${urlBase}/${turma.id}`, {
    method: "DELETE",
    headers: obterHeaders(false)
  });
  return await resposta.json();
}

export async function consultarTurmas(termo) {
  let resposta;
  if (termo === undefined)
    resposta = await fetch(urlBase + "/buscarTodos", {
      method: "GET",
      headers: obterHeaders(false)
    });
  else
    resposta = await fetch(urlBase + "/" + termo, {
      method: "GET",
      headers: obterHeaders(false)
    });
  const resultado = await resposta.json();
  return resultado.turmas;
}