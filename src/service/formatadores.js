export  function formatarCelular(entrada) {
    var valor = entrada;
    if (valor.length === 11) {
        entrada= `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else {
        entrada = valor;
    }
    return entrada;
}


export  function formatarTelefone(entrada) {
    var valor = entrada;
    if (valor.length === 10) {
        entrada = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
    } else {
        entrada = valor;
    }
    return entrada;
}


export  function formatarCPF(entrada, exec) {
    if(exec){

        let valor= entrada
        // if (valor.length === 11) {
            //     entrada = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6, 9)}-${valor.slice(9)}`;
            // } else {
                //     entrada = valor;
                // }
        if(valor.length===3 || valor.length===7) //123.456.789-12
        entrada = valor+"."
        if(valor.length===11)
            entrada = valor+"-"
    }
    return entrada;
}


export  function formatarCNPJ(entrada) {
    var valor = entrada;
    if (valor.length === 14) {
        entrada = `${valor.slice(0, 2)}.${valor.slice(2, 5)}.${valor.slice(5, 8)}/${valor.slice(8, 12)}-${valor.slice(12)}`;
    } else {
        entrada = valor;
    }
    return entrada;
}


export  function formatarCEP(entrada,exec){
    if(exec){
        var valor = entrada;
        // if (valor.length === 8) {
            //     entrada = `${valor.slice(0, 5)}-${valor.slice(5)}`;
            // } else {
                //     entrada = valor;
                // }
        if(entrada.length==5)
            entrada=valor+"-";        
                
    }
    return entrada;
}

export function formatarRG(entrada,exec) {
    if(exec){
        var valor = entrada;
        // if (valor.length === 9) {
            //     entrada = `${valor.slice(0, 1)}.${valor.slice(1, 4)}.${valor.slice(4, 7)}-${valor.slice(7)}`;
            // } else {
                //     entrada = valor;
                // }

        if(valor.length==2 || valor.length==6)
            entrada=valor+".";
        if(valor.length==10)
            entrada=valor+"-";       
    }
    return entrada;
}
