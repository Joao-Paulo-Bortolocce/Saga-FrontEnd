const urlBase = 'http://localhost:8080/notificacao';

export async function gravarNotificacao(notificacao) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(notificacao),
  });
  return await resposta.json();
}

export async function visualizarNotificacao(id) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': "application/json" }
  });
  return await resposta.json();
}

export async function excluirNotificacao(id) {
  const resposta = await fetch(`${urlBase}/${id}`, { method: "DELETE" });
  return await resposta.json();
}

export async function consultarNotificacao() {
  let resposta = await fetch(urlBase, {
      method: "GET",
    });
  const resultado = await resposta.json();
  return resultado.ListaNotificacao;
}
