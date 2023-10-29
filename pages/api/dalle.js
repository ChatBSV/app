// pages/api/dalle.js
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

// Function to handle DALLE request
async function handleDalleRequest(reqBody) {
  // Default values for prompt and format
  const { prompt = "a scenic view of a mountain", format = "512x512" } = reqBody;
  
  console.log('Entered handleDalleRequest with:', { prompt, format });

  const validFormats = ["256x256", "512x512", "1024x1024"];
  
  if (!validFormats.includes(format)) {
    console.error("Invalid format");
    throw new Error("Invalid format");
  }

  const apiEndpoint = "https://api.openai.com/v1/images/generations";
  console.log('Using API endpoint:', apiEndpoint);

  try {
    console.log('About to make POST request to DALLE API.');
    const response = await axios.post(apiEndpoint, {
      prompt,
      n: 1,
      response_format: "url",
      size: format
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Received response from DALLE API:', response);

    const imageUrl = response.data.url;
    console.log('Generated image URL:', imageUrl);
    return { imageUrl };
  } catch (error) {
    console.error("Error generating image:", error.response ? error.response.data : error);
    throw error;
  }
}

// Default export to handle POST requests
export default async (req, res) => {
  console.log("Received request with method:", req.method);
  console.log("Received request with body:", req.body);

  if (req.method !== "POST") {
    console.log('Method not allowed. Only POST is supported.');
    res.status(405).end(); // Method Not Allowed
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
