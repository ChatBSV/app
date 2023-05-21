// netlify/functions/getChatReply.js

const axios = require('axios');

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY } = process.env;
  const { prompt, chatHistory, lastMessage } = JSON.parse(event.body);

  let messages;

  if (!chatHistory || chatHistory.length === 0) {
    // First message, include the core prompt as the system message
    messages = [
      { role: 'system', content: process.env.CORE_PROMPT },
      { role: 'user', content: prompt }
    ];
  } else {
    // Subsequent messages, include chatHistory + user input
    messages = [
      ...chatHistory.map((message) => ({ role: 'user', content: message.content })),
      { role: 'user', content: prompt }
    ];
  }

  const inputTokens = countTokens(JSON.stringify(messages));

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 2000
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const assistantResponse = response.data.choices[0].message.content;
    const outputTokens = countTokens(assistantResponse);
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

// Helper function to count tokens by characters (assuming 4 characters per token)
function countTokens(text) {
  // Counting tokens by characters (4 characters per token)
  return Math.ceil(text.length / 4);
}
