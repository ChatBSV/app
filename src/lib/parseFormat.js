// src/lib/parseFormat.js

function parseAspectRatio(aspectRatio, defaultFormat) {
    const aspectRatios = {
      "1:1": "1024x1024",        // Square
      "16:9": "1792x1024",       // Widescreen horizontal
      "9:16": "1024x1792",       // Widescreen vertical
      "3:2": "1792x1024",        // Classic photo horizontal
      "2:3": "1024x1792",        // Classic photo vertical
      "4:3": "1024x1024",        // Standard video
      "3:4": "1024x1792",        // Standard video vertical
      "horizontal": "1792x1024", // Generic horizontal
      "vertical": "1024x1792",   // Generic vertical
      "fullhd": "1792x1024",     // Full HD resolution
      "hd": "1024x1024",         // HD resolution
      "ultrawide": "1792x1024",  // Ultrawide monitors
      "wide": "1792x1024",       // Generic wide
      // Additional ratios and terms can be added here
    };
  
    return aspectRatios[aspectRatio.toLowerCase()] || defaultFormat;
  }
  
  function parseSingleDimension(dimension) {
    const defaultSquare = "1024x1024";
    const horizontalFormat = "1792x1024";
  
    switch(dimension) {
      case "512":
      case "1024":
        // For "512" and "1024", default to square 1024x1024
        return defaultSquare;
      case "1792":
      case "1920":
      case "1080":
        // For "1792", "1920", and "1080", default to horizontal 1792x1024
        return horizontalFormat;
      default:
        // Default to square if dimension is not recognized
        return defaultSquare;
    }
  }
  
  
  export default function parseFormat(prompt) {
    const defaultFormat = "1024x1024";
    const formatRegex = /--format\s+([^\s]+)/i;
    const match = prompt.match(formatRegex);
    let format = defaultFormat;
  
    if (match) {
      const formatSpecRaw = match[1].toLowerCase();
      prompt = prompt.replace(formatRegex, "").trim(); // Remove the format specification
  
      if (formatSpecRaw.includes('x')) {
        // Direct dimension specifications
        format = formatSpecRaw; // Use the specified dimensions directly
      } else if (formatSpecRaw.includes(':') || isNaN(parseInt(formatSpecRaw))) {
        // Aspect ratio or descriptive term
        format = parseAspectRatio(formatSpecRaw, defaultFormat);
      } else {
        // Single dimension specification
        format = parseSingleDimension(formatSpecRaw);
      }
    }
  
    return { format, newPrompt: prompt };
  }
  