//  const urlBase= "http://localhost:4000/pessoa";
 const urlBase= "http://localhost:8080/pessoa";


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
    const resposta = await fetch(urlBase+"/"+ pessoa.cpf,{
        "method": "DELETE",
    
    })
    const resultado = await  resposta.json();
    return resultado;
    
}

export async function consultarPessoa(termo){
    let resposta
    if(termo==undefined){

        resposta = await fetch(urlBase+"/buscarTodos",{
            "method": "GET",
        })
        const resultado =await  resposta.json();
        return resultado.listaDePessoas;
    }
    else
        resposta = await fetch(urlBase+"/"+termo,{
            "method": "GET",
        })
    const resultado =await  resposta.json();
    return resultado.pessoa;
}

export async function consultarPessoaSemAlunos(termo){
    let resposta
    if(termo==undefined){

        resposta = await fetch(urlBase+"/buscarTodosSemAlunos",{
            "method": "GET",
        })
        const resultado =await  resposta.json();
        return resultado.listaDePessoas;
    }
        resposta = await fetch(urlBase+"/buscarSemAlunos/"+termo,{
            "method": "GET",
        })
    const resultado =await  resposta.json();
    return resultado.pessoa;
}