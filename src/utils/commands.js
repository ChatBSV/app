// src/utils/commands.js

import { nanoid } from 'nanoid';

export const setModel = (modelCommand, addMessageToChat) => {
    const model = modelCommand.toLowerCase().includes('4') ? 'gpt-4' : 'gpt-3.5-turbo';
    localStorage.setItem('selectedModel', model);
    addMessageToChat({
        id: nanoid(),
        role: 'loading',
        content: `GPT model set to ${model}`,
        txid: '',
        model: model,
    });
};

export const setDalleModel = (modelCommand, addMessageToChat) => {
    const model = modelCommand.toLowerCase().includes('2') ? 'dall-e-2' : 'dall-e-3';
    localStorage.setItem('selectedDalleModel', model);
    addMessageToChat({
        id: nanoid(),
        role: 'loading',
        content: `DALL-E model set to ${model}`,
        txid: '',
        model: model,
    });
};

export const getRequestType = (prompt) => {
    if (prompt.toLowerCase().startsWith('/imagine')) return 'image';
    if (prompt.toLowerCase().startsWith('/meme')) return 'meme';
    return 'text';
};
