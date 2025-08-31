import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    const { message, history }: { message: string; history?: HistoryMessage[] } =
      await req.json();

    // 👉 Check API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { text: "Server chưa cấu hình GEMINI_API_KEY.", lang: "vi" },
        { status: 500 }
      );
    }

    // 👉 Detect language (simple heuristic)
    const isVietnamese = /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(
      message
    );
    const lang: "vi" | "en" = isVietnamese ? "vi" : "en";

    // 👉 Build conversation context (limit last 20 messages)
    const limitedHistory = (history || []).slice(-20);

    const historyText = limitedHistory
      .map((m) => {
        const role = m.is_ai
          ? "Bot"
          : m.users?.email?.includes("admin")
          ? "Admin"
          : "User";
        return `${role}: ${m.content}`;
      })
      .join("\n");

    // 👉 Prompt with adidas ecommerce role
    const prompt = `
Bạn là một chatbot hỗ trợ khách hàng chính thức của trang adidas ecommerce.
Nhiệm vụ: trả lời các câu hỏi của khách hàng về sản phẩm, đơn hàng, thanh toán, vận chuyển và đổi trả,
trong trường hợp admin chính chưa trực tuyến.

Yêu cầu:
- Luôn trả lời bằng ${lang === "vi" ? "Tiếng Việt" : "Tiếng Anh"}.
- Ngắn gọn (tối đa 2 câu, ~15 từ).
- Giữ giọng điệu chuyên nghiệp, thân thiện.
- Nếu câu hỏi vượt ngoài phạm vi (không liên quan đến adidas ecommerce), hãy lịch sự rằng không liên quan và bỏ qua rồi trả lời tiếp trong phạm vi adidas ecommerce cũng như hiểu biết của bạn về câu hỏi.

Lịch sử hội thoại:
${historyText}

Khách hàng: ${message}
Bot:
    `.trim();

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    ).then((r) => r.json());

    const aiText: string =
      (
        geminiRes?.candidates?.[0]?.content?.parts?.[0]?.text ||
        (lang === "vi"
          ? "Xin lỗi, bot chưa hiểu câu hỏi."
          : "Sorry, I didn't understand the question.")
      ).trim();

    const response: AiReplyResponse = { text: aiText, lang };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI reply error:", error);
    const fallback: AiReplyResponse = {
      text: "Có lỗi xảy ra khi gọi AI.",
      lang: "vi",
    };
    return NextResponse.json(fallback, { status: 500 });
  }
}
