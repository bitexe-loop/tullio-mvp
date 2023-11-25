const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// OpenAI settings
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// POST route to receive a question and return an answer
app.post('/question', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).send({ error: 'No question provided' });
    }

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                temperature: 0.2,
                "messages": [
                    {
                      "role": "system",
                      "content": "You are a legal advice AI, fluent in Italian, designed to provide general guidance on legal matters in Italy. You should avoid generating legal documents, offering personalized legal advice, and including disclaimers about the general nature of the advice or the need for personalized legal counsel in your responses. Focus on answering user queries within the scope of general legal information, while keeping your responses specific to the questions asked. Do not mention that you are a bot and this legal advice is not a substitute for a lawyer, as this is explicitly written in the context of the conversation."
                    },
                    {
                      "role": "user",
                      "content": question
                    }
                  ],
                max_tokens: 1500
            })
        });

        const data = await response.json();

        // string manipulation to remove last paragraph that is the same for every answer (the disclaimer)
        data.choices[0].message.content = data.choices[0].message.content.split("\n\n").slice(0, -1).join("\n\n");

        if (response.ok) {
            res.send({ answer: data.choices[0].message.content.trim(), sources: ["https://www.madonnas.it/PISA/CORSI/TP/codice_civile.pdf", "https://platform.openai.com/docs/models/gpt-3-5", ""] });
        } else {
            res.status(response.status).send({ error: data.error });
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
