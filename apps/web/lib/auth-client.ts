// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api/auth" // ✅ trỏ vào [...all]
});
// import { auth } from "@/lib/auth"
// import { createAuthClient } from "better-auth/client"
// import { inferAdditionalFields } from "better-auth/client/plugins"

// export const authClient = createAuthClient({
//   plugins: [inferAdditionalFields<typeof auth>()]
// })
 
// const signIn = async () => {
//     const data = await authClient.signIn.social({
//         provider: "github"
//     })
// }

// export type Session = typeof authClient.$Infer.Session
