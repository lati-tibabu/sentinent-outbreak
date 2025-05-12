
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Google AI plugin.
// Some Gemini models might work without an API key for basic usage.
// However, for full access to all models (e.g., Gemini 1.5 Pro, specific versions) and features,
// or to avoid rate limits, an API key is usually required.
// Ensure GOOGLE_API_KEY is set in your .env file if you encounter issues or need advanced features.
const googleAIParams: ConstructorParameters<typeof googleAI>[0] = {};
if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== "YOUR_GOOGLE_API_KEY_HERE") {
  googleAIParams.apiKey = process.env.GOOGLE_API_KEY;
} else {
  // Log a warning if the API key is missing or is the placeholder, but still try to initialize.
  // Genkit's GoogleAI plugin might still function for some models without it.
  console.warn("GOOGLE_API_KEY not found or is a placeholder in .env. Genkit AI features might be limited or require a key for certain models.");
}

export const ai = genkit({
  plugins: [googleAI(googleAIParams)],
  // Default model can be overridden in specific prompts/flows
  model: 'googleai/gemini-1.5-flash-latest', // Ensure this model is accessible with/without key.
});

