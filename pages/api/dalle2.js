// pages/api/dalle2.js

import axios from 'axios';
import dotenv from "dotenv";
import parseFormat from '../../src/lib/parseFormat2'; 

dotenv.config();

export async function handleDalle2Request(reqBody) {
  let {
    prompt = "a scenic view of a mountain",
    model = "dall-e-2", // default to DALL-E 2
    n = 1
  } = reqBody;

  let { format, newPrompt } = parseFormat(prompt); // Change from const to let

  console.log('Entered handleDalle2Request with:', { prompt, model, format, n });

  // Remove /imagine command if present in prompt
  newPrompt = newPrompt.replace(/\/imagine\s*/i, '');

  // Valid formats for DALL-E 2
  const validFormatsDalle2 = ["512x512", "1024x1024"];

  if (model === "dall-e-2" && !validFormatsDalle2.includes(format)) {
    console.error("Invalid format for DALL-E 2");
    throw new Error("Invalid format for DALL-E 2");
  }

  const apiEndpoint = "https://api.openai.com/v1/images/generations";
  console.log('Using API endpoint:', apiEndpoint);

  try {
    console.log('About to make POST request to DALLE API.');
    const response = await axios.post(apiEndpoint, {
      prompt: newPrompt,
      model,
      n,
      response_format: "url",
      size: format
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Received response from DALLE API:', response);
    
    const imageUrl = response.data.data[0].url;
    console.log('Generated image URL:', imageUrl);
    return { imageUrl };
  } catch (error) {
    console.error("Error generating image:", error.response ? error.response.data : error);
    throw error;
  }
}

const dalle2Handler = async (req, res) => {
  console.log("Received request with method:", req.method);
  console.log("Received request with body:", req.body);

  if (req.method !== "POST") {
    console.log('Method not allowed. Only POST is supported.');
    res.status(405).end();
    return;
  }

  try {
    console.log('Attempting to handle DALLE2 request.');
    const result = await handleDalle2Request(req.body);
    console.log('Successfully handled DALLE2 request. Returning:', result);
    res.status(200).json(result);
  } catch (error) {
    console.log('Failed to handle DALLE2 request. Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export default dalle2Handler;
