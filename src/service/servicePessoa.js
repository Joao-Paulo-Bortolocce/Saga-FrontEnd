function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`
  };
  if (contentType) headers["Content-type"] = "application/json";
  return headers;
}

//  const urlBase= "http://localhost:4000/pessoa";
 const urlBase= "http://localhost:8080/pessoa";


export async function gravarPessoa(pessoa){
    const resposta = await fetch(urlBase,{
        "method": "POST",
        headers: obterHeaders(),
        "body":JSON.stringify(pessoa)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarPessoa(pessoa){
    const resposta = await fetch(urlBase,{
        "method": "PUT",
        headers: obterHeaders(),
        "body":JSON.stringify(pessoa)
    })
    const resultado = await resposta.json();
    return resultado;
    
}

export async function excluirPessoa(pessoa){
    const resposta = await fetch(urlBase+"/"+ pessoa.cpf,{
        "method": "DELETE", "headers": obterHeaders(false),
    
    })
    const resultado = await  resposta.json();
    return resultado;
    
}

export async function consultarPessoa(termo){
    let resposta
    if(termo==undefined){

        resposta = await fetch(urlBase+"/buscarTodos",{
            "method": "GET", "headers": obterHeaders(false),
        })
        const resultado =await  resposta.json();
        return resultado.listaDePessoas;
    }
    else
        resposta = await fetch(urlBase+"/"+termo,{
            "method": "GET", "headers": obterHeaders(false),
        })
    const resultado =await  resposta.json();
    return resultado.pessoa;
}

export async function consultarPessoaSemAlunos(termo){
    let resposta
    if(termo==undefined){

        resposta = await fetch(urlBase+"/buscarTodosSemAlunos",{
            "method": "GET", "headers": obterHeaders(false),
        })
        const resultado =await  resposta.json();
        return resultado.listaDePessoas;
    }
        resposta = await fetch(urlBase+"/buscarSemAlunos/"+termo,{
            "method": "GET", "headers": obterHeaders(false),
        })
    const resultado =await  resposta.json();
    return resultado.pessoa;
}

export async function consultarPossivelProfissional(termo){
    let resposta
    if(termo==undefined){
        resposta = await fetch(urlBase+"/buscarTodosSemProfissional",{
            "method": "GET", "headers": obterHeaders(false),
        })
        const resultado =await  resposta.json();
        return resultado.listaDePessoas;
    }
        resposta = await fetch(urlBase+"/buscarSemProfissional/"+termo,{
            "method": "GET", "headers": obterHeaders(false),
        })
    const resultado =await  resposta.json();
    return resultado.pessoa;
}