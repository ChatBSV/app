// pages/api/openai.js

/**
 * Handles the OpenAI request by sending a prompt and history to the OpenAI API.
 * @param {string} prompt - The user's prompt for the conversation.
 * @param {Array} history - The conversation history.
 * @returns {Object} - The response from the OpenAI API, including the assistant's message and token count.
 * @throws {Error} - If the OPENAI_API_KEY is not set in environment variables, CORE_PROMPT is not set and no history is provided, or if the history is not an array of message objects.
 */

import axios from 'axios';

export async function handleOpenAIRequest(prompt, history) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const filteredHistory = history.filter(
    (message) => !['help', 'loading', 'error', 'image'].includes(message.role)
  );

  if (!OPENAI_API_KEY) {
    throw new Error('The OPENAI_API_KEY is not set in environment variables.');
  }
  
  if (!CORE_PROMPT && (!history || history.length === 0)) {
    throw new Error('The CORE_PROMPT is not set in environment variables and no history is provided.');
  }

  if (history && !Array.isArray(history)) {
    throw new Error('History should be an array of message objects.');
  }

  const messages = filteredHistory.length > 0
    ? [...filteredHistory.map((message) => ({ role: message.role, content: message.content })), { role: 'user', content: prompt }]
    : [{ role: 'system', content: CORE_PROMPT }, { role: 'user', content: prompt }];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
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
    // Extracting error message from OpenAI response
    const errorMessage = error.response?.data?.error?.message || error.message;
    throw new Error(`OpenAI Request failed: ${errorMessage}`);
  }
}
