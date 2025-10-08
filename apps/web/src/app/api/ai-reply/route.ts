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
    const isVietnamese =
      /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(
        message
      );
    const lang: "vi" | "en" = isVietnamese ? "vi" : "en";

    // 🧠 Get session from Better Auth
    const session = await auth.api.getSession({ headers: req.headers });
    const user = session?.user || null;

    // 🧠 Build conversation context
    const limitedHistory = (history || []).slice(-15); // only keep last 15 messages
    const historyText =
      limitedHistory
        .map((m) => {
          const role = m.is_ai ? "Assistant" : "User";
          const name = m.users?.name ?? "Guest";
          return `${role} (${name}): ${m.content}`;
        })
        .join("\n") || "No previous conversation.";

    // 🧠 Knowledge Base
    const knowledgeBase = `
Knowledge Base:
- "Trionda" is the official match ball for the FIFA World Cup 2026™, manufactured by Adidas.
- Adidas previously created other official balls: Al Rihla (2022), Telstar 18 (2018), Brazuca (2014).
- Adidas offers a variety of products: shoes, apparel, accessories, and football gear.
- Always respond with accurate and confident information if the question relates to Adidas products, orders, returns, or brand history.
- Never ask back for clarification if the term exists in this knowledge base.
- Always greet the user by name if available.
- If user’s question is not related to Adidas, still answer helpfully using general world knowledge.
`;

    // 🧠 System Prompt
    const systemPrompt = `
You are an AI assistant for the official Adidas ecommerce website: https://adidas-mocha.vercel.app/.
You are integrated into the backend and can access user info via Better Auth.

User info:
- ID: ${user?.id ?? "unknown"}
- Name: ${user?.name ?? "Guest"}
- Email: ${user?.email ?? "unknown"}

Your goals:
- Answer ANY question the user asks — no restrictions.
- Prioritize Adidas-related topics: products, orders, shipping, returns, payments.
- Use your world knowledge when needed.
- Always answer in ${lang === "vi" ? "Vietnamese" : "English"}.
- Be professional, friendly, accurate, and complete.
- Do not ask for clarification if you already have enough info to answer.
- Greet the user by their name if known.

${knowledgeBase}

Conversation so far:
${historyText}

User: ${message}
Assistant:
    `.trim();

    // 🧠 Call Gemini API
    const geminiResponse = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
      ],
      config: {
        temperature: 0.6,
        maxOutputTokens: 2048,
      },
    });

    const aiText: string =
      geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      (lang === "vi"
        ? "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể thử lại nhé."
        : "Sorry, I didn’t quite understand your question. Could you please try again?");

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
