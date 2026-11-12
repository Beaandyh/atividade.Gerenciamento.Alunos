//trazer a lista ✅

//saber qual é o último ID cadatrado ✅

//somar + 1, para ser o próximo ID ✅

//return
import { listarTodos } from "../MANIPULADOR/manipuladorArquivo.js";
export async function gerarNovoID() {
    const registroAlunos = await listarTodos();

    //pegar todos os IDs existentes
    const ids = registroAlunos.map((aluno) => aluno.id);

    const novoId = Math.max(... ids) +1;
    return novoId;
}

