import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./email";
import { db } from "@/db";
// import { jwt } from "better-auth/plugins/jwt";

export type Session = typeof auth.$Infer.Session // 👈 Lấy type Session
export type User = typeof auth.$Infer.Session.user; // 👈 Lấy type User
 
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
  }),
  pages: {
    signIn: "/",
    signOut: "/",
  },
  socialProviders: {
    facebook: { 
      clientId: process.env.FACEBOOK_CLIENT_ID as string, 
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string, 
    }, 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true, // Only if you want to block login completely
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, newEmail, url }) {
        await sendEmail({
          to: user.email,
          subject: "Approve email change",
          text: `Your email has been changed to ${newEmail}. Click the link to approve the change: ${url}`,
        });
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
  // plugins: [
  //   jwt({
  //     jwks: {
  //       keyPairConfig: {
  //         alg: "ES512",
  //       },
  //     },
  //     jwt: {
  //       issuer: "http://localhost",
  //       audience: "http://localhost",
  //       expirationTime: "1h", // access token
  //       definePayload: ({ user }) => ({
  //         sub: user.id,
  //         email: user.email,
  //         name: user.name,
  //       }),
  //     },
  //   }),
  // ],
});
