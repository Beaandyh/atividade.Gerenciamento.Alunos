import express from "express";
import { listarTodos, salvarTodos, buscarId } from "./MANIPULADOR/manipuladorArquivo.js";
import { gerarNovoID } from "./FUNCOES/functions.js";  


const app = express();
const PORT = 3000;

app.use(express.json());

// ROTA 1: Listar todos os alunos
app.get("/alunos", async (req, res) => {
    try {
        const alunos = await listarTodos();
        return res.status(200).json(alunos);
    } catch (erro) {
        console.error("Erro ao listar os alunos:", erro);
        return res.status(500).json({ erro: "Não foi possível listar os alunos." });
    }
});

// ROTA 2: Buscar um aluno específico pelo ID
app.get("/alunos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const aluno = await buscarId(id);

        if (!aluno) {
            return res.status(404).json({ erro: "O aluno não foi encontrado." });
        }

        return res.status(200).json(aluno);
    } catch (erro) {
        console.error("Erro ao buscar o aluno:", erro);
        return res.status(500).json({ erro: "Não foi possível buscar o aluno." });
    }
});

// ROTA 3: Cadastrar um novo aluno
app.post("/alunosNovo", async (req, res) => {
    try {
        const { matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo } = req.body;

        // Valida se todos os campos obrigatórios foram enviados
        if (!matricula || !nome || !turma || !data || !presente === undefined) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        //gerando um novo ud único
        const id = await gerarNovoID();
        //cria  o objeto
        const novoCadastro = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: presente,
            motivoSaida: motivoSaida || null, 
            minutosFora: Number(minutosFora) || 0,
            alertaTempo: alertaTempo || false
        };

        //trazer a lista (listar todos)
        const registroAlunos = await listarTodos();
        registroAlunos.push(novoCadastro);
        await salvarTodos(registroAlunos);

        return res.status(201).json({ mensagem: "Cadastro realizado com sucesso." });
    } catch (error) {
        console.error("Erro ao salvar cadastro:", error);
        return res.status(500).json({ error: "Não foi possível salvar o cadastro." });
    }
});

// ROTA 4: Atualizar o registro de um aluno existente
app.put("/alunos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo } = req.body;
        const listaAlunos = await listarTodos();

        const alunoExiste = listaAlunos.some((aluno) => aluno.id === id);
        if (!alunoExiste) {
            return res.status(404).json({ erro: "Aluno não encontrado." });
        }

        if (!matricula || !nome || !turma || !data || presente || !motivoSaida || minutosFora || !alertaTempo) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        //Como eu fiz:
           //const cadastros = await listarTodos();
            // Verifica se o ID já existe para evitar duplicidade
            //const idExiste = cadastros.some((alunosNovo) => alunosNovo.id === Number(id));
            //if (idExiste) {
            //  return res.status(400).json({ erro: "Já existe um atendimento com este ID." });
            //}
        const alunoAtualizado = {
            id: Number(id),
            matricula,
            nome,
            turma,
            data,
            presente,
            motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo
        };

        const listaAtualizada = listaAlunos.map((aluno) =>
            aluno.id === id ? alunoAtualizado : aluno
        );

        await salvarTodos(listaAtualizada);

        return res.status(200).json({ mensagem: "Cadastro do aluno atualizado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao alterar o cadastro:", erro);
        return res.status(500).json({ erro: "Não foi possível alterar e salvar o cadastro do aluno." });
    }
});

// ROTA 5: Excluir o registro de um aluno
app.delete("/alunos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const listaAlunos = await listarTodos();

        const listaAtualizada = listaAlunos.filter((aluno) => aluno.id !== id);

        if (listaAtualizada.length === listaAlunos.length) {
            return res.status(404).json({ erro: "Aluno não encontrado para exclusão." });
        }

        await salvarTodos(listaAtualizada);

        return res.status(200).json({ mensagem: "Aluno excluído com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar cadastro:", erro);
        return res.status(500).json({ erro: "Não foi possível deletar o cadastro do aluno." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT} 🚀`);
});