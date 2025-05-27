const urlBase = "http://localhost:8080/habilidades-da-ficha";
function obterHeaders(contentType = true) {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `${token}`
    };
    if (contentType) headers["Content-type"] = "application/json";
    return headers;
}

export async function incluirHabilidadeDaFicha(habilidadeDaFicha) {
    const res = await fetch(urlBase, {
        "method": "POST",
        headers: obterHeaders(),
        "body": JSON.stringify(habilidadeDaFicha)
    });
    return res.json();
}

export async function alterarHabilidadeDaFicha(habilidadeDaFicha) {
    const res = await fetch(urlBase, {
        "method": "PUT",
        headers: obterHeaders(),
        "body": JSON.stringify(habilidadeDaFicha)
    });
    return res.json();
}

export async function consultarHabilidadesDaFicha(idFicha) {
    const res = await fetch(urlBase + "/" + idFicha, {
        "method": "GET",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function consultarTodasHabFicha() {
    const res = await fetch(urlBase, {
        "method": "GET",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function apagarHabilidadeDaFicha(idHab, idFicha) {
    const res = await fetch(urlBase + "/" + idHab + "/" + idFicha, {
        "method": "DELETE",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}