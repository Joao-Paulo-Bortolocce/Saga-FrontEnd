//  const urlBase= "http://localhost:4000/pessoa";
 const urlBase= "http://localhost:8080/pessoa";


export async function gravarPessoa(pessoa){
    const resposta = await fetch(urlBase+"/gravar",{
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
    const resposta = await fetch(urlBase+"/alterar",{
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
    const resposta = await fetch(urlBase+ "/apagar/"+ pessoa.cpf,{
        "method": "DELETE",
    
    })
    const resultado = await  resposta.json();
    return resultado;
    
}

export async function consultarPessoa(termo){
    let resposta
    if(termo==undefined)
        resposta = await fetch(urlBase+"/buscarTodos",{
            "method": "GET",
        })
    else
        resposta = await fetch(urlBase+"/"+termo,{
            "method": "GET",
        })
    const resultado =await  resposta.json();
    return resultado.listaDePessoas;
}