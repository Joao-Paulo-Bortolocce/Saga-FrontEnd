

const urlBase = "http://localhost:8080/ficha";

export async function gravarFicha(ficha) {
    const res = await fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(ficha),
    });
    return res.json();
}

export async function alterarFicha(ficha) {
    const res = await fetch(urlBase, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ficha),  
    })
    const result = await res.json();
    return result;
}

export async function excluirFicha(ficha) {
    const res = await fetch(urlBase + "/apagar/" + ficha.ficha_id, {
        method: "DELETE",
    });
    const result = await res.json();
    return result;
}

export async function consultarFicha() {
    const res = await fetch(urlBase, {
        method: "GET"
    });
    const result = await res.json();
    return result;
}