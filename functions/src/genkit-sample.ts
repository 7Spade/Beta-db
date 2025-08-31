// Import the Genkit core libraries and plugins.
import { vertexAI } from '@genkit-ai/vertexai';
import { genkit, z } from 'genkit';

// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 2.0 Flash.
import { gemini20Flash } from '@genkit-ai/vertexai';

// Cloud Functions for Firebase supports Genkit natively. The onCallGenkit function creates a callable
// function from a Genkit action. It automatically implements streaming if your flow does.
import { onCallGenkit } from 'firebase-functions/https';

// 类型定义
type AuthData = any;

// Genkit models generally depend on an API key. APIs should be stored in Cloud Secret Manager so that
// access to these sensitive values can be controlled. defineSecret does this for you automatically.
// If you are using Google generative AI you can get an API key at https://aistudio.google.com/app/apikey
import { defineSecret } from 'firebase-functions/params';
const apiKey = defineSecret('GOOGLE_GENAI_API_KEY');

// The Firebase telemetry plugin exports a combination of metrics, traces, and logs to Google Cloud
// Observability. See https://firebase.google.com/docs/genkit/observability/telemetry-collection.
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';
enableFirebaseTelemetry();

const ai = genkit({
  plugins: [
    // Load the Vertex AI plugin. You can optionally specify your project ID
    // by passing in a config object; if you don't, the Vertex AI plugin uses
    // the value from the GCLOUD_PROJECT environment variable.
    vertexAI({ location: 'us-central1' }),
  ],
});

// Define a simple flow that prompts an LLM to generate menu suggestions.
const menuSuggestionFlow = ai.defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string().describe('A restaurant theme').default('seafood'),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (subject, { sendChunk }) => {
    // Construct a request and send it to the model API.
    const prompt = `Suggest an item for the menu of a ${subject} themed restaurant`;
    const { response, stream } = ai.generateStream({
      model: gemini20Flash,
      prompt: prompt,
      config: {
        temperature: 1,
      },
    });

    for await (const chunk of stream) {
      sendChunk(chunk.text);
    }

    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return (await response).text;
  }
);

export const menuSuggestion = onCallGenkit(
  {
    // Uncomment to enable AppCheck. This can reduce costs by ensuring only your Verified
    // app users can use your API. Read more at https://firebase.google.com/docs/app-check/cloud-functions
    // enforceAppCheck: true,

    // 启用身份验证策略：使用自定义函数验证用户身份
    authPolicy: (authData: AuthData | undefined) => {
      // 检查用户是否已登录
      if (!authData?.uid) {
        throw new Error('用户必须登录');
      }

      // 检查用户是否验证过邮箱
      if (!authData.token?.email_verified) {
        throw new Error('用户必须验证邮箱');
      }

      // 可以添加更多验证逻辑，比如检查用户角色
      // if (authData.token?.role !== 'admin') {
      //   throw new Error("用户权限不足");
      // }

      return true;
    },

    // Grant access to the API key to this function:
    secrets: [apiKey],
  },
  menuSuggestionFlow
);
