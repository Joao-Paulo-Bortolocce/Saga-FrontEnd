const urlBase = "http://localhost:8080/avaliacaodamatricula";

function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`
  };
  if (contentType) headers["Content-type"] = "application/json";
  return headers;
}

export async function gravarAvaliacao(avaliacao){
    const resposta = await fetch(urlBase,{
        "method": "POST",
        headers: obterHeaders(),
        "body":JSON.stringify(avaliacao)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarAvaliacao(avaliacao){
    const resposta = await fetch(urlBase,{
        "method": "PUT",
        headers: obterHeaders(),
        "body":JSON.stringify(avaliacao)
    })
    const resultado = await resposta.json();
    return resultado;
}

export async function consultarTodos() {
    const res = await fetch(urlBase, {
        method: "GET",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function buscarAvaliacoesDeMat(idMat) {
    const res = await fetch(urlBase + "/" + idMat, {
        method: "GET",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function buscarAvaliacaoDeMatHab(idMat, idHab) {
    const res = await fetch(urlBase + "/" + idMat + "/" + idHab, {
        method: "GET",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function excluirAvaliacao(idMat, idHab){
    const resposta = await fetch(urlBase+ "/apagar/"+ idMat + "/" + idHab,{
        "method": "DELETE", "headers": obterHeaders(false),
        headers: obterHeaders(false),
    })
    const resultado = await  resposta.json();
    return resultado;
}