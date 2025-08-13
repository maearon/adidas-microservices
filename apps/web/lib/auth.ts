// import { signIn } from 'next-auth/react';
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { headers } from 'next/headers';
 
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  pages: {
    signIn: "/account-login",
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});

export const getSession = async () => auth.api.getSession({
    headers: await headers(),
});

// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// // import { PrismaClient } from "./src/generated/prisma";
// import { PrismaClient } from "@prisma/client"
// import { inferAdditionalFields } from "better-auth/client/plugins";

// const prisma = new PrismaClient();


// export const auth = betterAuth({
//     database: prismaAdapter(prisma, {
//         provider: "postgresql"
//     }),
//     socialProviders: {
//         google: {
//             clientId: process.env.GOOGLE_CLIENT_ID as string, 
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
//         },
//     },
//     plugins: [inferAdditionalFields()],
// })

// export type Session = typeof auth.$Infer.Session
