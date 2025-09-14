import { Resend } from "resend";
interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailValues) {
  const resendKey = process.env.RESEND_API_KEY;
  
  if (!resendKey) {
    console.error("❌ resend api key not found! Please set RESEND_API_KEY or RESEND_API_KEY environment variable.");
    console.error("Expected format: re_dB8");
    throw new Error("Resend Api Key not configured");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: "manhng132@prmail.vn", // verification@codinginflow-sample.com
    to,
    subject,
    text,
  });
}
