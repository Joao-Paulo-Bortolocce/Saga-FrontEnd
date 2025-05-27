function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`
  };
  if (contentType) headers["Content-type"] = "application/json";
  return headers;
}

const urlBase = "http://localhost:8080/anoletivo"

export async function gravarAnoLetivo(ano) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: obterHeaders(),
    body: JSON.stringify(ano),
  });
  const resultado =await  resposta.json();
  return resultado;
}

export async function alterarAnoLetivo(id, ano) {
  const resposta = await fetch(urlBase+"/"+id, {
    method: "PUT",
    headers: obterHeaders(),
    body: JSON.stringify(ano),
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function excluirAnoLetivo(ano) {
  const resposta = await fetch(urlBase+"/"+ano.id, { 
    method: "DELETE",
    headers: obterHeaders(false),
    });
  return await resposta.json();
}

export async function buscarAnosLetivos(termo){
    let resposta
    if(termo==undefined)
        resposta = await fetch(urlBase,{
            method: "GET",
            headers: obterHeaders(false)
        })
    else
        resposta = await fetch(urlBase+"/"+termo,{
            "method": "GET",
            headers: obterHeaders(false)
        })
    const resultado = await resposta.json();
    console.log(resultado);
    return resultado.anoletivo;
}