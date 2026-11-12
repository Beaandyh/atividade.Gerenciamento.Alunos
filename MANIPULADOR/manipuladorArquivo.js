import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoDdos = path.join(__dirname, "..", "dados.json");

export async function listarTodos() {
    const dados = await fs.readFile(caminhoDdos, "utf-8");
    return JSON.parse(dados);
}

export async function salvarTodos(dados) {
    await fs.writeFile(caminhoDdos, JSON.stringify(dados, null, 2), "utf-8");
}

export async function buscarId(id) {
    const todos = await listarTodos();
    return todos.find(item => item.id === id) || null;
}