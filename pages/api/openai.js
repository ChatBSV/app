
// pages/api/openai.js
import axios from 'axios';

export async function handleOpenAIRequest(reqBody, reqHeaders) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const { prompt, history } = reqBody;
  const { requestType } = reqHeaders;

  let messages;

  if (history && history.length > 0) {
    const lastAssistantMessage = history.filter(
      (message) => message.role === 'assistant'
    ).pop();

    if (lastAssistantMessage) {
      messages = [
        { role: 'assistant', content: lastAssistantMessage.content },
        { role: 'user', content: prompt },
      ];
    }
  }

  if (!messages) {
    messages = [
      { role: 'system', content: CORE_PROMPT },
      { role: 'user', content: prompt },
    ];
  }

  const source = axios.CancelToken.source();

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages,
        max_tokens: 3000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cancelToken: source.token,
      }
    );

    const assistantResponse = response.data.choices[0].message.content;
    const tokens = response.data.usage.total_tokens;

    return { message: assistantResponse, tokens: tokens };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}