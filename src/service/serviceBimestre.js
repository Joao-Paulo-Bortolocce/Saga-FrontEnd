const urlBase = "http://localhost:8080/bimestre";

function obterHeaders(contentType = true) {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `${token}`
    };
    if (contentType) headers["Content-type"] = "application/json";
    return headers;
}


export async function consultarBimestre() {
    const res = await fetch(urlBase , {
        method: "GET",
        headers: obterHeaders(false)
    });
    const result = await res.json();
    return result;
}