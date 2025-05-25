const urlBase = "http://localhost:8080/frequencia";

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

export async function gravarFrequencia(dados) {
    const resposta = await fetch(urlBase, {
        "method": "POST",
        headers: obterHeaders(),
        "body": JSON.stringify(dados)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarFrequencia(dados) {
    const resposta = await fetch(urlBase, {
        "method": "PUT",
        headers: obterHeaders(),
        "body": JSON.stringify(dados)
    })
    const resultado = await resposta.json();
    return resultado;
}

export async function excluirFrequencia(dados) {
    const resposta = await fetch(urlBase + "/" + dados.id, {
        "method": "DELETE",
        headers: obterHeaders(false),
    })
    const resultado = await resposta.json();
    return resultado;
}

export async function consultarFreqAluno(dados) {
    let resposta = await fetch(urlBase + "/" + dados.id + "/" + dados.data,{
      method: "GET",
      headers: obterHeaders(false),
    });
    const resultado = await resposta.json();
    return resultado.frequencias;
}