// src/lib/parseFormat.js

function parseAspectRatio(aspectRatio, defaultFormat) {
    const aspectRatios = {
        "1:1": "1024x1024",
        "256": "256x256",
        "512": "512x512",
        "small": "512x512",
        // Add more aspect ratios as needed
    };
  
    return aspectRatios[aspectRatio] || defaultFormat;
  }
  
  function parseSingleDimension(dimension) {
    const defaultSquare = "1024x1024";
  
    if (dimension === "512") {
        return "512x512";
    } else if (dimension === "1024") {
        return defaultSquare;
    }
    return defaultSquare; // Default to square if dimension is not recognized
  }
  
  export default function parseFormat(prompt) {
    const defaultFormat = "1024x1024";
    const formatRegex = /--format\s+([^\s]+)/i; 
    const match = prompt.match(formatRegex);
    let format = defaultFormat;
  
    if (match) {
        const formatSpecRaw = match[1].toLowerCase();
        const formatSpec = formatSpecRaw.trim(); // Trim spaces and sanitize
        prompt = prompt.replace(formatRegex, "").trim(); // Remove the format specification
  
        if (formatSpec.includes('x')) {
            // Dimension specifications
            const [width, height] = formatSpec.split('x').map(Number);
            if (width === 512 && height === 512) {
                format = "512x512"; // 512x512 dimension
            } else {
                format = defaultFormat; // Default to 1024x1024
            }
        } else if (formatSpec.includes(':')) {
            // Aspect ratio specifications
            format = parseAspectRatio(formatSpec, defaultFormat);
        } else if (!isNaN(parseInt(formatSpec))) {
            // Single dimension specification
            format = parseSingleDimension(formatSpec);
        } else {
            // Descriptive formats
            switch (formatSpec) {
                case "square":
                case "1:1":
                    format = defaultFormat;
                    break;
                default:
                    // Leave default if no match
                    break;
            }
        }
    }
  
    return { format, newPrompt: prompt };
}
