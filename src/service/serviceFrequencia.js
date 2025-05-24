const urlBase = "http://localhost:8080/frequencia";

export async function gravarFrequencia(dados) {
    const resposta = await fetch(urlBase, {
        "method": "POST",
        "headers": {
            "Content-type": "application/json"
        },
        "body": JSON.stringify(dados)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarFrequencia(dados) {
    const resposta = await fetch(urlBase, {
        "method": "PUT",
        "headers": {
            "Content-type": "application/json"
        },
        "body": JSON.stringify(dados)
    })
    const resultado = await resposta.json();
    return resultado;
}

export async function excluirFrequencia(dados) {
    const resposta = await fetch(urlBase + "/" + dados.id, {
        "method": "DELETE",
    })
    const resultado = await resposta.json();
    return resultado;
}

export async function consultarFreqAluno(dados) {
    let resposta = await fetch(urlBase + "/" + dados.id + "/" + dados.data,{
      method: "GET"
    });
    const resultado = await resposta.json();
    return resultado.frequencias;
}