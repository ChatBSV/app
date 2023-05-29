// netlify/functions/getChatReply.js

const axios = require('axios');

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const { prompt, lastUserMessage, txid, history } = JSON.parse(event.body);

  let messages;

  if (history && history.length > 0) {
    const lastAssistantMessage = history.find(
      (message) => message.role === 'assistant'
    );

    messages = [
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      { role: 'user', content: prompt },
    ];
  } else {
    messages = [
      { role: 'system', content: CORE_PROMPT },
      { role: 'user', content: prompt },
    ];
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantResponse = response.data.choices[0].message.content;
    const tokens = response.data.usage.total_tokens;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: assistantResponse, tokens: tokens }),
    };
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error('API Error:', error.response.data.error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.response.data.error.message }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'An error occurred during processing.' }),
      };
    }
  }
};
