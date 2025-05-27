const urlBase = "http://localhost:8080/turma";
function obterHeaders(contentType = true) {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `${token}`
    };
    if (contentType) headers["Content-type"] = "application/json";
    return headers;
}

export async function gravarTurma(turma) {
  const resposta = await fetch(`${urlBase}/gravar`, {
    method: "POST",
    headers: obterHeaders(),
    body: JSON.stringify(turma),
  });
  return await resposta.json();
}

export async function excluirTurma(letra, serieId, anoLetivoId, profissionalRa, salaId) {
  const resposta = await fetch(
    `${urlBase}/${letra}/${serieId}/${anoLetivoId}/${profissionalRa}/${salaId}`,
    { method: "DELETE", headers: obterHeaders(false) }
  );
  return await resposta.json();
}

export async function buscarTodasTurmas() {
  const resposta = await fetch(`${urlBase}/buscarTodos`, {
        "method": "GET",
        headers: obterHeaders(false)
    });
  return await resposta.json();
}

export async function buscarTurmasPorTermo(termo) {
  const resposta = await fetch(`${urlBase}/buscar/${termo}`, {
        "method": "GET",
        headers: obterHeaders(false)
    });
  return await resposta.json();
}

export async function buscarSeries() {
  const resposta = await fetch("http://localhost:8080/serie/buscarTodos", {
        "method": "GET",
        headers: obterHeaders(false)
    });
  return await resposta.json();
}

export async function buscarAnosLetivos() {
  const resposta = await fetch("http://localhost:8080/anoletivo/buscarTodos", {
        "method": "GET",
        headers: obterHeaders(false)
    });
  return await resposta.json();
}

export async function buscarProfissionais() {
  const resposta = await fetch("http://localhost:8080/profissional", {
        "method": "GET",
        headers: obterHeaders(false)
    });
  return await resposta.json();
}

export async function buscarSalas() {
  const resposta = await fetch("http://localhost:8080/sala/buscarTodos", {
        "method": "GET",
        headers: obterHeaders(false)
    });
  return await resposta.json();
}