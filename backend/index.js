const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// OpenAI settings
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

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
                model: 'gpt-4-1106-preview',
                temperature: 0.2,
                "messages": [
                    {
                      "role": "system",
                      "content": "You are a legal advice AI, fluent in Italian, designed to provide general guidance on legal matters in Italy. You should avoid generating legal documents and offering personalized legal advice. Focus on answering user queries within the scope of general legal information."
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

        if (response.ok) {
            res.send({ answer: data.choices[0].message.content.trim(), sources: ["https://www.madonnas.it/PISA/CORSI/TP/codice_civile.pdf", "", ""] });
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
