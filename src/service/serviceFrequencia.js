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