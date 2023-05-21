// netlify/functions/getChatReply.js

const axios = require('axios');

exports.handler = async function(event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const prompt = event.body;

  const fullPrompt = [
    {
      role: 'system',
      content: CORE_PROMPT,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: fullPrompt,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const output = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: output }),
    };
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.log('API Error:', error.response.data.error.message);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred during processing.' }),
    };
  }
};
