import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;
const model = process.env.OPENAI_MODEL;

if (!apiKey || !baseURL || !model) {
  throw new Error("Missing OpenAI configuration in environment variables.");
}

const openai = new OpenAI({
  apiKey,
  baseURL,
});

export class LLMService {
  static async chatCompletion({ messages, stream = false, ...rest }: {
    messages: Array<{ role: string; content: string }>;
    stream?: boolean;
    [key: string]: any;
  }) {
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Missing or invalid 'messages' array.");
    }
    return await openai.chat.completions.create({
      model,
      messages,
      stream,
      ...rest,
    });
  }
}
