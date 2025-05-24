const urlBase = 'http://localhost:8080/sala';

export async function gravarSala(sala) {
  const resposta = await fetch(urlBase, {
    method: "POST",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(sala),
  });
  const resultado =await  resposta.json();
  return resultado;
}

export async function alterarSala(id, sala) {
  const resposta = await fetch(urlBase+"/"+id, {
    method: "PUT",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify(sala),
  });
  const resultado = await resposta.json();
  return resultado;
}

export async function excluirSala(sala) {
  const resposta = await fetch(urlBase+"/"+sala.id, { 
    method: "DELETE" 
    });
  return await resposta.json();
}

export async function consultarSala(termo){
    let resposta
    if(termo==undefined)
        resposta = await fetch(urlBase,{
            "method": "GET",
        })
    else
        resposta = await fetch(urlBase+"/"+termo,{
            "method": "GET",
        })
    const resultado = await resposta.json();
    return resultado.salas;
}