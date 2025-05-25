const urlBase = "http://localhost:8080/graduacao";

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

export async function gravarGraduacao(graduacao) {
    const resposta = await fetch(urlBase, {
        "method": "POST",
        headers: obterHeaders(),
        "body": JSON.stringify(graduacao)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarGraduacao(graduacao) {
    const resposta = await fetch(urlBase+"/"+graduacao.id, {
        "method": "PUT",
        headers: obterHeaders(),
        "body": JSON.stringify(graduacao)
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function excluirGraduacao(graduacao) {
    const resposta = await fetch(urlBase + "/" + graduacao.id, {
        "method": "DELETE",
        headers: obterHeaders(false),
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function consultarGraduacao(termo) {
    let resposta
    if (termo == undefined) {
        resposta = await fetch(urlBase+"/buscarTodos"  , {
            "method": "GET",
            headers: obterHeaders(false),
        })
        const resultado = await resposta.json();
        return resultado.listaGraduacao;
    }
    resposta = await fetch(urlBase + "/" + termo, {
        "method": "GET",
        headers: obterHeaders(false),
    })
    const resultado = await resposta.json();
    return resultado.graduacao;
}