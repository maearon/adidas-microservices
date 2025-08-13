import { betterAuth } from "better-auth"
 
export const auth = betterAuth({
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
  },
})
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
