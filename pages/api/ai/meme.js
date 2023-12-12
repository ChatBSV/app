// pages/api/meme.js

import axios from 'axios';
import dotenv from 'dotenv';
import parseFormat from '../../../src/lib/parseFormat';

dotenv.config();

async function callDalle(prompt) {
    const { format, newPrompt } = parseFormat(prompt);

    // Define DALL-E 3 model and other parameters
    const model = 'dall-e-3';
    const n = 1; // DALL-E 3 supports generating one image at a time
    const size = format || '1024x1024'; // Default size if not specified
    const quality = 'standard';
    const response_format = 'url';
    const style = 'vivid';

    const apiEndpoint = 'https://api.openai.com/v1/images/generations';
    const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(apiEndpoint, {
            prompt: newPrompt,
            model,
            n,
            quality,
            response_format,
            size,
            style,
        }, { headers });

        return response.data.data[0].url;
    } catch (error) {
        console.error('Error calling DALL-E:', error);
        throw error;
    }
}

export async function handleMemeRequest({ text: userInput }) {
    const systemPrompt = process.env.MEME_SYSTEM_PROMPT;
    const prompt = `Your user input: ${userInput} - Your task: ${systemPrompt} - User Input: ${userInput}`;
    const imageUrl = await callDalle(prompt);
    return { imageUrl }; // Return a single image URL
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text } = req.body;
        const { imageUrl } = await handleMemeRequest({ text });
        return res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error in meme API:', error);
        return res.status(500).json({ error: 'Failed to process meme request.' });
    }
}
