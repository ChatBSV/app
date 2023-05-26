// netlify/functions/getChatReply.js

const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const { prompt, lastUserMessage, txid } = JSON.parse(event.body);

  const messages = [
    { role: 'system', content: CORE_PROMPT },
    ...(lastUserMessage !== prompt
      ? [{ role: 'user', content: lastUserMessage }]
      : []),
    { role: 'user', content: prompt },
  ];

  try {
    const response = await apiClient.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 2000,
    }, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const assistantResponse = response.data.choices[0].message.content;
    const tokens = response.data.choices[0].message.total_tokens;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: assistantResponse, tokens, txid }),
    };
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error('API Error:', error.response.data.error.message);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred during processing.' }),
    };
  }
};

