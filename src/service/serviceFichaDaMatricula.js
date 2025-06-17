
const urlBase = "http://localhost:8080/fichaDaMatricula";
function obterHeaders(contentType = true) {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `${token}`
    };
    if (contentType) headers["Content-type"] = "application/json";
    return headers;
}
export async function gravarFichaDaMatricula(fichaDaMatricula) {
    const resposta = await fetch(urlBase, {
        "method": "POST",
        headers: obterHeaders(),
        "body": JSON.stringify(fichaDaMatricula)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarFichaDaMatricula(fichaDaMatricula) {
    const resposta = await fetch(urlBase, {
        "method": "PUT",
        headers: obterHeaders(),
        "body": JSON.stringify(fichaDaMatricula)
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function excluirFichaDaMatricula(fichaDaMatricula) {
    const resposta = await fetch(urlBase + "/" + fichaDaMatricula.id, {
        "method": "DELETE",
        headers:obterHeaders(false)
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function consultarFichaDaMatricula(validadas) {
    let resposta
    if (validadas == undefined) {
<<<<<<< HEAD
        resposta = await fetch(urlBase  , {
=======
        resposta = await fetch(urlBase + "?validadas=0" , {
>>>>>>> joaopaulo
            "method": "GET",
            headers:obterHeaders(false)
        })
        const resultado = await resposta.json();
        return resultado.listaDeFichaDaMatriculas;
    }
<<<<<<< HEAD
    resposta = await fetch(urlBase + "?validadas=" + termo, {
=======
    resposta = await fetch(urlBase + "?validadas=" + validadas, {
>>>>>>> joaopaulo
        "method": "GET",
        headers:obterHeaders(false)
    })
    const resultado = await resposta.json();
    return resultado.listaDeFichaDaMatriculas;
}

export async function consultarAvaliacoesDaFichaDaMatricula(matId,fichaId) {
    let resposta
    
    resposta = await fetch(urlBase + `/buscaAvaliacoes/${matId}/${fichaId}`, {
        "method": "GET",
         headers: obterHeaders(false),
    })

    const resultado = await resposta.json();
    return resultado.listaDeAvaliacoes;
}
