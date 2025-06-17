

const urlBase = "http://localhost:8080/materia";
function obterHeaders(contentType = true) {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `${token}`
    };
    if (contentType) headers["Content-type"] = "application/json";
    return headers;
}

export async function gravarMateria(materia) {
    const res = await fetch(urlBase + "/gravar", {
        method: "POST",
        headers: obterHeaders(),
        body: JSON.stringify(materia),
    });
    return res.json();
}

export async function alterarMateria(materia) {
    const res = await fetch(urlBase + "/alterar" + materia.id, {
        method: "PUT",
        headers: obterHeaders(),
        body: JSON.stringify(materia),
    })
    const result = await res.json();
    return result;
}

export async function excluirMateria(materia) {
    const res = await fetch(urlBase + "/apagar/" + materia.id, {
        method: "DELETE",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}

export async function consultarMateria() {
    const res = await fetch(urlBase + "/buscarTodas", {
        method: "GET",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}