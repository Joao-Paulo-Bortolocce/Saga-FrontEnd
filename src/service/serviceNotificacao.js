const urlBase = 'http://localhost:8080/notificacao';

function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    'Authorization': `${token}`
  };

  if (contentType) {
    headers['Content-type'] = 'application/json';
  }

  return headers;
}

export async function gravarNotificacao(notificacao) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: obterHeaders(),
    body: JSON.stringify(notificacao),
  });
  return await resposta.json();
}

export async function visualizarNotificacao(id) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: obterHeaders(),
  });
  return await resposta.json();
}

export async function excluirNotificacao(id) {
  const resposta = await fetch(`${urlBase}/${id}`, 
    { 
      method: "DELETE",
      headers: obterHeaders(false),
    });
  return await resposta.json();
}

export async function consultarNotificacao() {
  let resposta = await fetch(urlBase, {
      method: "GET",
      headers: obterHeaders(false),
    });
  const resultado = await resposta.json();
  return resultado.ListaNotificacao;
}
