const urlBase = "http://localhost:8080/habilidade";

export async function incluirHabilidade(habilidade) {
    const res = await fetch(urlBase, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(habilidade)
    });
    return res.json();
}

export async function atualizarHabilidade(habilidade) {
    const res = await fetch(urlBase, {
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(habilidade)
    });
    return res.json();
}

export async function buscarHabilidadesSer(idSer) {
    const res = await fetch(urlBase + "/buscarTodasSer/" + idSer, {
        "method": "GET"
    });
    const result = await res.json();
    return result;
}

export async function consultarHabMat(idMat) {
    const res = await fetch(urlBase + "/buscarTodasMat/" + idMat, {
        method: "GET"
    });
    const result = await res.json();
    return result;
}

export async function apagarHabilidade(idHab) {
    const res = await fetch(urlBase + "/apagar/" + idHab, {
        "method": "DELETE"
    });
    const result = await res.json();
    return result;
}