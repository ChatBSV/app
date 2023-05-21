// netlify/functions/getChatReply.js

const axios = require('axios');

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY } = process.env;
  const { prompt, chatHistory, lastMessage } = JSON.parse(event.body);

  const messages = [
    ...(chatHistory ? chatHistory.map((message) => ({ role: 'user', content: message })) : []),
    { role: 'system', content: process.env.CORE_PROMPT },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 2000,
        log_level: 'info' // Include log level to get token counts
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const assistantResponse = response.data.choices[0].message.content;

    // Calculate the total tokens consumed
    const logs = response.data.choices[0].logprobs;
    const inputTokens = logs.token_logprobs.reduce((count, tokenLog) => count + tokenLog.length, 0);
    const outputTokens = assistantResponse.split(' ').length;
    const totalTokens = inputTokens + outputTokens;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: assistantResponse, totalTokens })
    };
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.log('API Error:', error.response.data.error.message);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred during processing.' })
    };
  }
};
