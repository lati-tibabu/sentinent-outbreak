
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Google AI plugin with API key if available
const googleAIParams: ConstructorParameters<typeof googleAI>[0] = {};
if (process.env.GOOGLE_API_KEY) {
  googleAIParams.apiKey = process.env.GOOGLE_API_KEY;
}

export const ai = genkit({
  plugins: [googleAI(googleAIParams)],
  // Default model can be overridden in specific prompts/flows
  // model: 'googleai/gemini-1.5-flash-latest', // Example
});
