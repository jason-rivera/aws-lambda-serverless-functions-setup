/**
 * Base route "/" won't work in AWS Lambda Serverless Function.
 *
 * Also, app.listen won't work in AWS Lambda Serverless Function.
 */

require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// const PORT = 3000;
const { Configuration, OpenAIApi } = require('openai');

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
  organization: 'org-Afl5yl2Yr3FiTJMEqEHM1tKn',
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Test GET route
app.get('/test', (req, res) => {
  res.send('Hello World!');
});

// POST route for Preggo app
app.post('/preggo', async (req, res) => {
  const { item } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Can pregnant women eat${item}?`,
        },
      ],
    });

    res.status(200).json({
      completion: response.data.choices[0].message,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal serveasdfasdfr error' });
  }
});

// app.listen(PORT, () => {
//   console.log(`Example app listening at http://localhost:${PORT}`);
// });

module.exports.handler = serverless(app);
