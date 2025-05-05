export async function buscarAnosLetivos() {
    const resposta = await fetch("http://localhost:8080/anoletivo/buscarTodos");
    return await resposta.json();
}