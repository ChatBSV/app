//pages/api/openai.js

import axios from 'axios';

export async function handleOpenAIRequest(prompt, history) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;

  // Ensure environment variables are set
  if (!OPENAI_API_KEY) {
    throw new Error('The OPENAI_API_KEY is not set in environment variables.');
  }
  
  if (!CORE_PROMPT && (!history || history.length === 0)) {
    throw new Error('The CORE_PROMPT is not set in environment variables and no history is provided.');
  }

  // Validate history structure
  if (history && !Array.isArray(history)) {
    throw new Error('History should be an array of message objects.');
  }

  const messages = history?.length
    ? history.map((message) => ({ role: message.role, content: message.content }))
    : [{ role: 'system', content: CORE_PROMPT }, { role: 'user', content: prompt }];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages,
        max_tokens: 4000,
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

    return { message: assistantResponse, tokens: tokens };
  } catch (error) {
    console.error('OpenAI Request Error:', error);
    throw new Error(`OpenAI Request failed: ${error.response?.data?.error || error.message}`);
  }
}