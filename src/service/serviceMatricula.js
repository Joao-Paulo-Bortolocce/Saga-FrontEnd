//  const urlBase= "http://localhost:4000/matricula";
const urlBase = "http://localhost:8080/matricula";
function obterHeaders(contentType = true) {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `${token}`
    };
    if (contentType) headers["Content-type"] = "application/json";
    return headers;
}
export async function gravarMatricula(matricula) {
    const resposta = await fetch(urlBase, {
        "method": "POST",
        headers: obterHeaders(),
        "body": JSON.stringify(matricula)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarMatricula(matricula) {
    const resposta = await fetch(urlBase, {
        "method": "PUT",
        headers: obterHeaders(),
        "body": JSON.stringify(matricula)
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function excluirMatricula(matricula) {
    const resposta = await fetch(urlBase + "/" + matricula.id, {
        "method": "DELETE",
        headers:obterHeaders(false)
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function consultarMatricula(termo) {
    let resposta
    if (termo == undefined) {
        resposta = await fetch(urlBase  , {
            "method": "GET",
            headers:obterHeaders(false)
        })
        const resultado = await resposta.json();
        return resultado.listaDeMatriculas;
    }
    resposta = await fetch(urlBase + "/" + termo, {
        "method": "GET",
    })
    const resultado = await resposta.json();
    return resultado.matricula;
}

export async function consultarMatriculaFiltros(termos) {
    const resposta = await fetch(urlBase + "/buscarTodasFiltradas?serie=" + termos.serie + "&anoLetivo=" + termos.anoLetivo
        + "&valido=" + termos.valido, {
        "method": "GET",
        headers:obterHeaders(false)
    });
    const resultado = await resposta.json();
    return resultado.listaDeMatriculas;
}