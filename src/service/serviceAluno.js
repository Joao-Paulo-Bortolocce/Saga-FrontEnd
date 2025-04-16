//  const urlBase= "http://localhost:4000/aluno";
const urlBase= "http://localhost:8080/aluno";



export async function gravarAluno(aluno){
    const resposta = await fetch(urlBase+"/gravar",{
        "method": "POST",
        "headers":{
            "Content-type":"application/json"
        },
        "body":JSON.stringify(aluno)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarAluno(aluno){
    const resposta = await fetch(urlBase+"/alterar",{
        "method": "PUT",
        "headers":{
            "Content-type":"application/json"
        },
        "body":JSON.stringify(aluno)
    })
    const resultado = await resposta.json();
    return resultado;
    
}

export async function excluirAluno(aluno){
    const resposta = await fetch(urlBase+ "/apagar/"+ aluno.ra,{
        "method": "DELETE",
    
    })
    const resultado = await  resposta.json();
    return resultado;
    
}

export async function consultarAluno(termo){
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
    return resultado.listaDeAlunos;
}

