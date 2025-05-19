function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`
  };
  if (contentType) headers["Content-type"] = "application/json";
  return headers;
}

const urlBase = "http://localhost:8080/reuniao";

export async function gravarReuniao(reuniao) {
    const resposta = await fetch("http://localhost:8080/reuniao/gravar", {
      method: "POST",
      headers: obterHeaders(),
      body: JSON.stringify(reuniao),
    });
    return await resposta.json();
  }
  
  export async function alterarReuniao(reuniao) {
    const resposta = await fetch(`http://localhost:8080/reuniao/${reuniao.reuniaoId}`, {
      method: "PUT",
      headers: obterHeaders(),
      body: JSON.stringify(reuniao),
    });
    return await resposta.json();
  }
  

export async function excluirReuniao(id) {
  const resposta = await fetch(`${urlBase}/${id}`, {
    method: "DELETE",
  });
  return await resposta.json();
}

export async function buscarTodasReunioes() {
  const resposta = await fetch(`${urlBase}/buscarTodos`, {
    method: "GET",
  });
  return await resposta.json();
}

export async function buscarReunioesPorTermo(termo) {
  const resposta = await fetch(`${urlBase}/buscar/${termo}`, {
    method: "GET",
  });
  return await resposta.json();
}

export async function buscarAnosLetivos() {
    const resposta = await fetch("http://localhost:8080/anoletivo/buscarTodos");
    return await resposta.json();
  }