const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// OpenAI settings
const OPENAI_API_URL = 'https://api.openai.com/v1/completions';
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
                model: 'text-davinci-003',
                temperature: 0.2,
                prompt: question,
                max_tokens: 3150
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.send({ answer: data.choices[0].text.trim() });
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
