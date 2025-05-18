const urlBase = "http://localhost:8080/graduacao";


export async function gravarGraduacao(graduacao) {
    const resposta = await fetch(urlBase, {
        "method": "POST",
        "headers": {
            "Content-type": "application/json"
        },
        "body": JSON.stringify(graduacao)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarGraduacao(graduacao) {
    const resposta = await fetch(urlBase+"/"+graduacao.id, {
        "method": "PUT",
        "headers": {
            "Content-type": "application/json"
        },
        "body": JSON.stringify(graduacao)
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function excluirGraduacao(graduacao) {
    const resposta = await fetch(urlBase + "/" + graduacao.id, {
        "method": "DELETE",
    })
    const resultado = await resposta.json();
    return resultado;

}

export async function consultarGraduacao(termo) {
    let resposta
    if (termo == undefined) {
        resposta = await fetch(urlBase+"/buscarTodos"  , {
            "method": "GET",
        })
        const resultado = await resposta.json();
        console.log(resultado.listaGraduacao);
        return resultado.listaGraduacao;
    }
    resposta = await fetch(urlBase + "/" + termo, {
        "method": "GET",
    })
    const resultado = await resposta.json();
    return resultado.graduacao;
}