const urlBase = "http://localhost:8080/habilidades-da-ficha";

export async function incluirHabilidadeDaFicha(habilidadeDaFicha) {
    const res = await fetch(urlBase, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(habilidadeDaFicha)
    });
    return res.json();
}

export async function alterarHabilidadeDaFicha(habilidadeDaFicha) {
    const res = await fetch(urlBase, {
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(habilidadeDaFicha)
    });
    return res.json();
}

export async function consultarHabilidadesDaFicha(idFicha) {
    const res = await fetch(urlBase + "/" + idFicha, {
        "method": "GET",
    });
    const result = await res.json();
    return result;
}

export async function consultarTodasHabFicha() {
    const res = await fetch(urlBase, {
        "method": "GET",
    });
    const result = await res.json();
    return result;
}

export async function apagarHabilidadeDaFicha(idHab, idFicha) {
    const res = await fetch(urlBase + "/" + idHab + "/" + idFicha, {
        "method": "DELETE"
    });
    const result = await res.json();
    return result;
}