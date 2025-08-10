import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY || ""
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Bạn là bot hỗ trợ khách hàng Adidas clone." },
                { text: message }
              ]
            }
          ]
        })
      }
    ).then(r => r.json());

    const aiText =
      geminiRes?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, bot chưa hiểu câu hỏi.";

    return NextResponse.json({ text: aiText });
  } catch (error) {
    console.error("AI reply error:", error);
    return NextResponse.json(
      { text: "Có lỗi xảy ra khi gọi AI." },
      { status: 500 }
    );
  }
}
