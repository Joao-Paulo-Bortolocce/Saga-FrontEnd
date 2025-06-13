const urlBase = "http://localhost:8080/ficha";

function obterHeaders(contentType = true) {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `${token}`
    };
    if (contentType) headers["Content-type"] = "application/json";
    return headers;
}

export async function gravarFicha(ficha) {
    const res = await fetch(urlBase, {
        method: "POST",
        headers: obterHeaders(),
        body: JSON.stringify(ficha),
    });
    return res.json();
}

export async function alterarFicha(ficha) {
    const res = await fetch(urlBase, {
        method: "PUT",
       headers: obterHeaders(),
        body: JSON.stringify(ficha),  
    })
    const result = await res.json();
    return result;
}

export async function excluirFicha(ficha) {
    const res = await fetch(urlBase + "/apagar/" + ficha.ficha_id, {
        method: "DELETE",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function consultarFicha() {
    const res = await fetch(urlBase, {
        method: "GET",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}