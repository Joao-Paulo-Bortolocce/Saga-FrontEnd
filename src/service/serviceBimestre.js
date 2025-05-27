const urlBase = "http://localhost:8080/bimestre";

export async function consultarBimestre() {
    const res = await fetch(urlBase , {
        method: "GET"
    });
    const result = await res.json();
    return result;
}