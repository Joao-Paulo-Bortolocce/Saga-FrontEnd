const urlBase = "http://localhost:8080/profissional";

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

export async function gravarProfissional(profissional) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: obterHeaders(),
    body: JSON.stringify(profissional)
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function alterarProfissional(profissional) {
  const resposta = await fetch(urlBase, {
    method: "PUT",
    headers: obterHeaders(),
    body: JSON.stringify(profissional)
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function excluirProfissional(profissional) {
  const resposta = await fetch(`${urlBase}/${profissional.profissional_rn}`, {
    method: "DELETE",
    headers: obterHeaders(false)
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function consultarProfissional(termo) {
  let resposta;
  if (termo === undefined) {
    resposta = await fetch(urlBase, {
      method: "GET",
      headers: obterHeaders(false)
    });
    const resultado = await resposta.json();
    return resultado.listaDeProfissionais;
  } else {
    resposta = await fetch(`${urlBase}/${termo}`, {
      method: "GET",
      headers: obterHeaders(false)
    });
    const resultado = await resposta.json();
    return resultado.profissional;
  }
}

export async function consultarUsuario(usuario) {
  const resposta = await fetch(`${urlBase}/${usuario.ra}/${usuario.senha}`, {
    method: "GET",
    headers: obterHeaders(false)
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function logarUsuario(usuario) {
  const resposta = await fetch(
    `http://localhost:8080/autenticacao/${encodeURIComponent(usuario.ra)}/${encodeURIComponent(usuario.senha)}`,
    {
      method: "GET",
      headers: obterHeaders(false)
    }
  );
  const resultado = await resposta.json();
  return resultado;
}

export async function consultarProfissionalSemAlunos(termo) {
  let resposta;
  if (termo === undefined) {
    resposta = await fetch(`${urlBase}/buscarTodosSemAlunos`, {
      method: "GET",
      headers: obterHeaders(false)
    });
    const resultado = await resposta.json();
    return resultado.listaDeProfissionais;
  } else {
    resposta = await fetch(`${urlBase}/buscarSemAlunos/${termo}`, {
      method: "GET",
      headers: obterHeaders(false)
    });
    const resultado = await resposta.json();
    return resultado.profissional;
  }
}

export async function consultarPossivelProfissional(termo) {
  let resposta;
  if (termo === undefined) {
    resposta = await fetch(`${urlBase}/buscarTodosSemProfissional`, {
      method: "GET",
      headers: obterHeaders(false)
    });
    const resultado = await resposta.json();
    return resultado.listaDeProfissionais;
  } else {
    resposta = await fetch(`${urlBase}/buscarSemProfissional/${termo}`, {
      method: "GET",
      headers: obterHeaders(false)
    });
    const resultado = await resposta.json();
    return resultado.profissional;
  }
}
