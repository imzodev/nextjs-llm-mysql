import { NextRequest, NextResponse } from "next/server";
import { LLMService } from "@/lib/llm-service";

export async function POST(req: NextRequest) {
  try {
    const { input, instructions, stream, ...rest } = await req.json();
    if (!input || typeof input !== "string") {
      console.error("[API/openai] Invalid input received:", input);
      return NextResponse.json({ error: "Missing or invalid 'input' string." }, { status: 400 });
    }

    // Optionally support streaming in the future
    let response;
    try {
      response = await LLMService.generate({ input, instructions, stream, ...rest });
    } catch (llmError: any) {
      return NextResponse.json({
        error: llmError.message || "LLMService.generate failed",
        stack: llmError.stack,
        input,
        model: process.env.LLM_MODEL,
      }, { status: 500 });
    }

    // Try to extract output_text for both OpenAI and Gemini
    let output_text = "";
    if (typeof response === "object" && response !== null) {
      if (typeof response.output_text === "string") {
        output_text = response.output_text;
      } else if (Array.isArray(response.candidates) && response.candidates.length > 0 && response.candidates[0].content?.parts?.length > 0) {
        // Gemini API typical response
        output_text = response.candidates[0].content.parts.map((p: any) => (typeof p === "string" ? p : p.text || "")).join(" ");
      } else if (typeof response === "object" && response.choices && Array.isArray(response.choices) && response.choices[0]?.message?.content) {
        // OpenAI chat fallback
        output_text = response.choices[0].message.content;
      }
    }
    return NextResponse.json({ output_text });
  } catch (error: any) {
    console.error("[API/openai] Unexpected API handler error", error);
    return NextResponse.json({ error: error.message || "Unknown error", stack: error.stack }, { status: 500 });
  }
}
