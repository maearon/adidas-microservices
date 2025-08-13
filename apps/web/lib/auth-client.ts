import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
 
export const authClient =  createAuthClient({
    //you can pass client configuration here
})
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
