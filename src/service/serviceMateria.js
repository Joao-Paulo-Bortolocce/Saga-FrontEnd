function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`
  };
  if (contentType) headers["Content-type"] = "application/json";
  return headers;
}

const urlBase = "http://localhost:4000/materia";

export async function gravarMateria(materia) {
    const res = await fetch(urlBase, {
        method: "POST",
        headers: obterHeaders(),
        body: JSON.stringify(materia),
    });
    return res.json();
}

export async function alterarMateria(materia) {
    const res = await fetch(urlBase + "/" + materia.materia_id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(materia),  
    })
    const result = await res.json();
    return result;
}

export async function excluirMateria(materia) {
    const res = await fetch(urlBase + "/" + materia.materia_id, {
        method: "DELETE",
    });
    const result = await res.json();
    return result;
}

export async function consultarMateria() {
    const res = await fetch(urlBase, {
        method: "GET"
    });
    const result = await res.json();
    return result;
}