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
  // const smtpPassword = process.env.SMTP_PASSWORD;
  
  // if (!smtpPassword) {
  //   console.error("❌ smtp password not found! Please set SMTP_PASSWORD environment variable.");
  //   console.error("Expected format: rqi_yum");
  //   throw new Error("Smtp Password Key not configured");
  // }
  
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_USERNAME!,
    to,
    subject,
    text,
  });
}
