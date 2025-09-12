import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { auth } from "./auth";
 
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), nextCookies()],
  //you can pass client configuration here
});

// Lấy type provider từ chính hàm signIn.social
type SocialSignInArgs = Parameters<typeof authClient.signIn.social>[0];
export type ProviderId = SocialSignInArgs["provider"];
