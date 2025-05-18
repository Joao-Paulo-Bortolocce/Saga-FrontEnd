//  const urlBase= "http://localhost:4000/profissional";
 const urlBase= "http://localhost:8080/profissional";


export async function gravarProfissional(profissional){
    const resposta = await fetch(urlBase,{
        "method": "POST",
        "headers":{
            "Content-type":"application/json"
        },
        "body":JSON.stringify(profissional)
    })
    const resultado = await resposta.json();
    return await resultado;
}

export async function alterarProfissional(profissional){
    const resposta = await fetch(urlBase,{
        "method": "PUT",
        "headers":{
            "Content-type":"application/json"
        },
        "body":JSON.stringify(profissional)
    })
    const resultado = await resposta.json();
    return resultado;
    
}

export async function excluirProfissional(profissional){
    const resposta = await fetch(urlBase+"/"+ profissional.profissional_ra,{
        "method": "DELETE",
    
    })
    const resultado = await  resposta.json();
    return resultado;
    
}

export async function consultarProfissional(termo){
    let resposta
    if(termo==undefined){

        resposta = await fetch(urlBase,{
            "method": "GET",
        })
        const resultado =await  resposta.json();
        return resultado.listaDeProfissionais;
    }
    else
        resposta = await fetch(urlBase+"/"+termo,{
            "method": "GET",
        })
    const resultado =await  resposta.json();
    return resultado.profissional;
}

export async function consultarUsuario(usuario){
    const resposta = await fetch(urlBase+"/"+usuario.ra+"/"+usuario.senha,{
        "method": "GET",
    })
    const resultado =await  resposta.json();
    return resultado;
}

export async function consultarProfissionalSemAlunos(termo){
    let resposta
    if(termo==undefined){

        resposta = await fetch(urlBase+"/buscarTodosSemAlunos",{
            "method": "GET",
        })
        const resultado =await  resposta.json();
        return resultado.listaDeProfissionais;
    }
        resposta = await fetch(urlBase+"/buscarSemAlunos/"+termo,{
            "method": "GET",
        })
    const resultado =await  resposta.json();
    return resultado.profissional;
}

export async function consultarPossivelProfissional(termo){
    let resposta
    if(termo==undefined){
        resposta = await fetch(urlBase+"/buscarTodosSemProfissional",{
            "method": "GET",
        })
        const resultado =await  resposta.json();
        return resultado.listaDeProfissionais;
    }
        resposta = await fetch(urlBase+"/buscarSemProfissional/"+termo,{
            "method": "GET",
        })
    const resultado =await  resposta.json();
    return resultado.profissional;
}