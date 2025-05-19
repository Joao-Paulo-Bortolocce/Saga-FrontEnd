const urlBase = 'http://localhost:4000/salas';

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

export async function gravarSalas(salas) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: obterHeaders(),
    body: JSON.stringify(salas),
  });
  return await resposta.json();
}

export async function alterarSalas(id, salas) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: obterHeaders(),
    body: JSON.stringify(salas),
  });
  return await resposta.json();
}

export async function excluirSalas(salas) {
  const resposta = await fetch(`${urlBase}/${salas.id}`, {
    method: "DELETE",
    headers: obterHeaders(false)
  });
  return await resposta.json();
}

export async function consultarSalas(termo) {
  let resposta;
  if (termo == undefined)
    resposta = await fetch(urlBase + "/", {
      method: "GET",
      headers: obterHeaders(false)
    });
  else
    resposta = await fetch(urlBase + "/" + termo, {
      method: "GET",
      headers: obterHeaders(false)
    });
  return await resposta.json();
}