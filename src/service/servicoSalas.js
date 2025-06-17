const urlBase = 'http://localhost:8080/sala';

function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    'Authorization': `${token}`
  };

  if (contentType) {
    headers['Content-type'] = 'application/json';
  }

  return headers;
}

export async function gravarSala(sala) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: obterHeaders(),
    body: JSON.stringify(sala),
  });
  const resultado =await  resposta.json();
  return resultado;
}

export async function alterarSala(id, sala) {
  const resposta = await fetch(urlBase+"/"+id, {
    method: "PUT",
    headers: obterHeaders(),
    body: JSON.stringify(sala),
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function excluirSala(sala) {
  const resposta = await fetch(urlBase+"/"+sala.id, { 
    method: "DELETE",
    headers: obterHeaders(false),
    });
  return await resposta.json();
}

export async function consultarSala(termo){
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
    return resultado.salas;
}