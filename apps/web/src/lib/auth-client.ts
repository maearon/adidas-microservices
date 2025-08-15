import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
 
export const authClient = createAuthClient({
    //you can pass client configuration here
});

// Lấy type provider từ chính hàm signIn.social
type SocialSignInArgs = Parameters<typeof authClient.signIn.social>[0];
export type ProviderId = SocialSignInArgs["provider"];
