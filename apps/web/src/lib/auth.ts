import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./email";
import { getDb } from "@/db";

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "pg",
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
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

let _auth: AuthInstance | undefined;

export function getAuth(): AuthInstance {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}

/**
 * Lazy Better Auth instance so the app can build without DATABASE_URL / full auth wiring.
 */
export const auth = new Proxy({} as AuthInstance, {
  get(_target, prop, receiver) {
    const inst = getAuth();
    const value = Reflect.get(inst, prop, receiver);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(inst);
    }
    return value;
  },
  has(_target, prop) {
    return Reflect.has(getAuth(), prop);
  },
});

export type Session = AuthInstance["$Infer"]["Session"];
export type User = AuthInstance["$Infer"]["Session"]["user"];
