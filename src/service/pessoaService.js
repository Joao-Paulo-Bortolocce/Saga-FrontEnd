 const urlBase= "http://localhost:4000/pessoa";

export async function gravarPessoa(pessoa){
    const resposta = await fetch(urlBase,{
        "method": "POST",
        "headers":{
            "Content-type":"application/json"
        },
        "body":JSON.stringify(pessoa)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarPessoa(pessoa){
    const resposta = await fetch(urlBase,{
        "method": "PUT",
        "headers":{
            "Content-type":"application/json"
        },
        "body":JSON.stringify(pessoa)
    })
    const resultado = await resposta.json();
    return resultado;
    
}

export async function excluirPessoa(pessoa){
    const resposta = await fetch(urlBase+ "/"+ pessoa.cpf,{
        "method": "DELETE",
    
    })
    const resultado = await  resposta.json();
    return resultado;
    
}

export async function consultarPessoa(termo){
    const resposta = await fetch(urlBase+"/"+termo,{
        "method": "GET",
    })
    const resultado =await  resposta.json();
    return resultado;
}