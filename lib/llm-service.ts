import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL;
const model = process.env.OPENAI_MODEL || process.env.LLM_MODEL;
const provider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
const defaultInstructions = "You are a helpful assistant.";


if (!apiKey || !baseURL || !model) {
  throw new Error("Missing llm configuration in environment variables.");
}
const openai = new OpenAI({ apiKey, baseURL });

export interface LLMProvider {
  generate(params: { input: string; instructions?: string; stream?: boolean; [key: string]: any }): Promise<any>;
}

export class GeminiLLMService implements LLMProvider {
  
  async generate({ input, instructions, stream = false, ...rest }: {
    input: string;
    instructions?: string;
    stream?: boolean;
    [key: string]: any;
  }) {
    if (!input || typeof input !== "string") {
      throw new Error("Missing or invalid 'input' string.");
    }
    if (!instructions || typeof instructions !== "string") {
      instructions = defaultInstructions;
    }
    return await openai.chat.completions.create({
      model: model as string,
      messages: [
        {"role": "system", "content": instructions},
        {"role": "user", "content": input}
      ],
      stream,
      ...rest,
    });
  }
}

export class OpenAILLMService implements LLMProvider {

  async generate({ input, instructions, stream = false, ...rest }: {
    input: string;
    instructions?: string;
    stream?: boolean;
    [key: string]: any;
  }): Promise<any> {
    if (!input || typeof input !== "string") {
      throw new Error("Missing or invalid 'input' string.");
    }
    if (!instructions || typeof instructions !== "string") {
      instructions = defaultInstructions;
    }
    return await openai.responses.create({
      model: model as string,
      input,
      instructions,
      stream,
      ...rest,
    });
  }
}



let LLMService: LLMProvider;
if (provider === "openai") {
  LLMService = new OpenAILLMService();
} else if (provider === "gemini") {
  LLMService = new GeminiLLMService();
} else {
  throw new Error(`Unknown LLM_PROVIDER: ${provider}`);
}

export { LLMService };
