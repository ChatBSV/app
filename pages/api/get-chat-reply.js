// pages/api/getChatReply.js

import axios from 'axios';

export default async function handler(req, res) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const { prompt, history } = req.body;

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

  req.on('close', () => {
    // Cancela a solicitação axios se a conexão com o cliente for fechada
    source.cancel('Request was aborted by the client.');
  });
  
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
        cancelToken: source.token, // Adiciona o token de cancelamento à solicitação axios
      }
    );

    const assistantResponse = response.data.choices[0].message.content;
    const tokens = response.data.usage.total_tokens;

    res.status(200).json({ message: assistantResponse, tokens: tokens });
  } catch (error) {
    console.error('Error:', error);
    if (axios.isCancel(error)) {
      console.log('Request was cancelled:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      if (error.response && error.response.data && error.response.data.error) {
        console.error('API Error:', error.response.data.error.message);
        res.status(500).json({ error: error.response.data.error.message });
      } else {
        res.status(500).json({ error: 'An error occurred during processing.' });
      }
    }
  }
};
