const urlBase = "http://localhost:8080/habilidade";

function obterHeaders(contentType = true) {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `${token}`
    };
    if (contentType) headers["Content-type"] = "application/json";
    return headers;
}


export async function incluirHabilidade(habilidade) {
    const res = await fetch(urlBase, {
        "method": "POST",
        headers:obterHeaders(),
        "body": JSON.stringify(habilidade)
    });
    return res.json();
}

export async function atualizarHabilidade(habilidade) {
    const res = await fetch(urlBase, {
        "method": "PUT",
       headers:obterHeaders(),
        "body": JSON.stringify(habilidade)
    });
    return res.json();
}

export async function buscarHabilidadesSer(idSer) {
    const res = await fetch(urlBase + "/buscarTodasSer/" + idSer, {
        "method": "GET",
        headers:obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function consultarHabMat(idMat) {
    const res = await fetch(urlBase + "/buscarTodasMat/" + idMat, {
        method: "GET",
        headers:obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function consultarHabSer(idMat, idSer) {
    const res = await fetch(urlBase + "/buscarTodas/" + idMat + "/" + idSer, {
        "method": "GET",
        headers:obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function apagarHabilidade(idHab) {
    const res = await fetch(urlBase + "/apagar/" + idHab, {
        "method": "DELETE",
        headers:obterHeaders(false)
    });
    const result = await res.json();
    return result;
}