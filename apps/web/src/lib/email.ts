import { Resend } from "resend";
interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailValues) {
  const resendKey = process.env.RESEND_API_KEY;
  
  if (!resendKey) {
    console.error("❌ resend key not found! Please set PRISMA_DATABASE_URL or DATABASE_URL environment variable.");
    console.error("Expected format: 123_abc");
    throw new Error("Database URL not configured");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: "verification@codinginflow-sample.com",
    to,
    subject,
    text,
  });
}
