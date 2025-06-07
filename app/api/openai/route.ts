import { NextRequest, NextResponse } from "next/server";
import { LLMService } from "@/lib/llm-service";

export async function POST(req: NextRequest) {
  try {
    const { messages, stream, ...rest } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing or invalid 'messages' array." }, { status: 400 });
    }

    // Optionally support streaming in the future
    const completion = await LLMService.chatCompletion({ messages, stream, ...rest });
    return NextResponse.json(completion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
