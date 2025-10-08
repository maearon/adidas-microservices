// C:\Users\manhn\source\adidas-microservices\apps\web\src\app\api\ai-reply\route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/lib/auth";

interface HistoryMessage {
  content: string;
  is_ai?: boolean;
  users?: {
    email: string;
    id: string;
    name: string;
  } | null;
}

interface AiReplyResponse {
  text: string;
  lang: "vi" | "en";
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, history }: { message: string; history?: HistoryMessage[] } =
      await req.json();

    // 🧠 Detect language
    const isVietnamese = /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(
      message
    );
    const lang: "vi" | "en" = isVietnamese ? "vi" : "en";

    // 🧠 Get session
    const session = await auth.api.getSession({ headers: req.headers });
    const user = session?.user || null;

    // 🧠 Build conversation context
    const limitedHistory = (history || []).slice(-20);
    const historyText = limitedHistory
      .map((m) => {
        const role = m.is_ai
          ? "Assistant"
          : m.users?.email?.includes("admin")
          ? "Admin"
          : "User";
        return `${role}: ${m.content}`;
      })
      .join("\n");

    // 🧠 Prompt
    const prompt = `
You are an AI assistant for the official Adidas ecommerce website: https://adidas-mocha.vercel.app/.
You are integrated into the backend system and can access user info through Better Auth.

Current user info:
- ID: ${user?.id ?? "unknown"}
- Name: ${user?.name ?? "Guest"}
- Email: ${user?.email ?? "unknown"}

Your task:
- Answer any question the user asks — no restrictions.
- Focus primarily on Adidas ecommerce topics (products, orders, shipping, returns, payments).
- If unrelated, still respond helpfully using your general knowledge.
- Always respond in ${lang === "vi" ? "Vietnamese" : "English"}.
- Be professional, friendly, and accurate.
- You may use your knowledge of the world and the web to give the best possible answer.

Conversation so far:
${historyText}

User: ${message}
Assistant:
    `.trim();

    // 🧠 Call Gemini SDK
    const geminiResponse = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 2048, // 🟩 allow long answers
      },
    });

    const aiText: string =
       geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      (lang === "vi"
        ? "Xin lỗi, tôi chưa hiểu câu hỏi của bạn."
        : "Sorry, I didn’t quite understand your question.");

    // return NextResponse.json({ text: aiText, lang });
    const result: AiReplyResponse = { text: aiText, lang };
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI reply error:", error);
    return NextResponse.json(
      {
        text:
          "Sorry, there was an error processing your request. Please try again later.",
        lang: "en",
      },
      { status: 500 }
    );
  }
}
