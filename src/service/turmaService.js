const urlBase = "http://localhost:8080/turma";

export async function gravarTurma(turma) {
  const resposta = await fetch(`${urlBase}/gravar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(turma),
  });
  return await resposta.json();
}

export async function excluirTurma(letra, serieId, anoLetivoId, profissionalRa, salaId) {
  const resposta = await fetch(
    `${urlBase}/${letra}/${serieId}/${anoLetivoId}/${profissionalRa}/${salaId}`,
    { method: "DELETE" }
  );
  return await resposta.json();
}

export async function buscarTodasTurmas() {
  const resposta = await fetch(`${urlBase}/buscarTodos`);
  return await resposta.json();
}

export async function buscarTurmasPorTermo(termo) {
  const resposta = await fetch(`${urlBase}/buscar/${termo}`);
  return await resposta.json();
}

export async function buscarSeries() {
  const resposta = await fetch("http://localhost:8080/serie/buscarTodos");
  return await resposta.json();
}

export async function buscarAnosLetivos() {
  const resposta = await fetch("http://localhost:8080/anoletivo/buscarTodos");
  return await resposta.json();
}

export async function buscarProfissionais() {
  const resposta = await fetch("http://localhost:8080/profissional");
  return await resposta.json();
}

export async function buscarSalas() {
  const resposta = await fetch("http://localhost:8080/sala/buscarTodos");
  return await resposta.json();
}