// pages/api/dalle.js


import axios from 'axios';
import dotenv from "dotenv";
import parseFormat from '../../src/lib/parseFormat'; 


dotenv.config();

export async function handleDalleRequest(reqBody) {
  let {
    prompt = "a scenic view of a mountain",
    model = "dall-e-3", // default to DALL-E 3
    quality = "standard", // DALL-E 3 specific parameter
    style = "vivid", // DALL-E 3 specific parameter
    n = 1
  } = reqBody;
  
  const { format, newPrompt } = parseFormat(prompt);

  console.log('Entered handleDalleRequest with:', { prompt, model, format, quality, style, n });

  // Remove /imagine command if present in prompt
  prompt = prompt.replace(/\/imagine\s*/i, '');

  // Valid formats for DALL-E 3
  const validFormatsDalle3 = ["1024x1024", "1792x1024", "1024x1792"];

  if (model === "dall-e-3" && !validFormatsDalle3.includes(format)) {
    console.error("Invalid format for DALL-E 3");
    throw new Error("Invalid format for DALL-E 3");
  }

  const apiEndpoint = "https://api.openai.com/v1/images/generations";
  console.log('Using API endpoint:', apiEndpoint);

  try {
    console.log('About to make POST request to DALLE API.');
    const response = await axios.post(apiEndpoint, {
      prompt: newPrompt,
      model,
      n,
      quality,
      response_format: "url",
      size: format,
      style
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


export default async (req, res) => {
  console.log("Received request with method:", req.method);
  console.log("Received request with body:", req.body);

  if (req.method !== "POST") {
    console.log('Method not allowed. Only POST is supported.');
    res.status(405).end();
    return;
  }

  try {
    console.log('Attempting to handle DALLE request.');
    const result = await handleDalleRequest(req.body);
    console.log('Successfully handled DALLE request. Returning:', result);
    res.status(200).json(result);
  } catch (error) {
    console.log('Failed to handle DALLE request. Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
