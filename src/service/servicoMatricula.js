//  const urlBase= "http://localhost:4000/matricula";
const urlBase = "http://localhost:8080/matricula";


export async function gravarMatricula(matricula) {
    const resposta = await fetch(urlBase, {
        "method": "POST",
        "headers": {
            "Content-type": "application/json"
        },
        "body": JSON.stringify(matricula)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarMatricula(matricula) {
    const resposta = await fetch(urlBase, {
        "method": "PUT",
        "headers": {
            "Content-type": "application/json"
        },
        "body": JSON.stringify(matricula)
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function excluirMatricula(matricula) {
    const resposta = await fetch(urlBase + "/" + matricula.id, {
        "method": "DELETE",

    })
    const resultado = await resposta.json();
    return resultado;
}

export async function consultarMatricula(termo) {
    let resposta
    if (termo == undefined) {
        resposta = await fetch(urlBase  , {
            "method": "GET",

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
    const resposta = await fetch(urlBase + "/buscarTodasFiltradas?serie=" + termos.serie.serieId + "&anoLetivo=" + termos.anoLetivo.id, {
        "method": "GET",
    });
    const resultado = await resposta.json();
    return resultado.listaDeMatriculas;
}