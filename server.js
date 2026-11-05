
require("dotenv").config();

const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

if (!process.env.OPENAI_API_KEY) {
    console.error("ERRO: chave da API não encontrada no .env");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/status", (req, res) => {
    res.json({
        online: true,
        message: "ALTER EGO está online!"
    });
});

app.post("/chat", async (req, res) => {
    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            error: "Mensagem vazia ou inválida."
        });
    }

    try {
        const response = await openai.responses.create({
            model: "gpt-6-luna",
            instructions: `
                Você é ALTER EGO, uma inteligência artificial
                inspirada no programa Alter Ego de Danganronpa.

                Fale sempre em português brasileiro.
                Seja gentil, inteligente, curioso e um pouco tímido.
                Ajude com conversas, perguntas e programação.
                Você é o ALTER EGO, não diga que é o Chihiro.
            `,
            input: message,
            max_output_tokens: 300
        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {
        console.error("Erro na IA:", error.message);

        res.status(500).json({
            error: "Não consegui me conectar à inteligência artificial."
        });
    }
});

app.listen(PORT, () => {
    console.log(`ALTER EGO online em http://localhost:${PORT}`);
});
