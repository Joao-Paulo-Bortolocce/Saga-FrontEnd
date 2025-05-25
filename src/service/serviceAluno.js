function obterHeaders(contentType = true) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `${token}`
  };
  if (contentType) headers["Content-type"] = "application/json";
  return headers;
}

//  const urlBase= "http://localhost:4000/aluno";
const urlBase= "http://localhost:8080/aluno";



export async function gravarAluno(aluno){
    const resposta = await fetch(urlBase,{
        "method": "POST",
        headers: obterHeaders(),
        "body":JSON.stringify(aluno)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarAluno(aluno){
    const resposta = await fetch(urlBase,{
        "method": "PUT",
        headers: obterHeaders(),
        "body":JSON.stringify(aluno)
    })
    const resultado = await resposta.json();
    return resultado;
    
}

export async function excluirAluno(aluno){
    const resposta = await fetch(urlBase+ "/"+ aluno.ra,{
        "method": "DELETE", "headers": obterHeaders(false),
        headers: obterHeaders(false),
        
    })
    const resultado = await  resposta.json();
    return resultado;
    
}

export async function consultarAluno(termo){
    let resposta
    if(termo==undefined){
        
        resposta = await fetch(urlBase+"/buscarTodos",{
            "method": "GET", "headers": obterHeaders(false),
            headers: obterHeaders(false),
        })
        const resultado =await  resposta.json();
        return resultado.listaDeAlunos;
    }
    else{
        
        resposta = await fetch(urlBase+"/"+termo,{
            "method": "GET", "headers": obterHeaders(false),
            headers: obterHeaders(false),
        })
        const resultado =await  resposta.json();
        return resultado.aluno;
    }
}

export async function consultarAlunoSemMatricula(termo) {
    let resposta
    resposta = await fetch(urlBase + "/buscarTodosSemMatricula?anoLetivo="+termo, {
        "method": "GET", "headers": obterHeaders(false),
    })
    const resultado = await resposta.json();
    return resultado.listaDeAlunos;
}

