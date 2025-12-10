import nodemailer from "nodemailer";

interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USERNAME!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });
}

export async function sendEmail({ to, subject, text }: SendEmailValues) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_USERNAME!,
    to,
    subject,
    text,
  });
}
