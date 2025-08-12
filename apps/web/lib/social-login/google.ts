// apps/web/lib/social-login/google.ts 
// https://console.cloud.google.com/apis/credentials?inv=1&invt=Ab5Jog&project=apt-helix-426002-r5
// git checkout 1242dc57c527178d6bffd6980c884ba4478bafd4 -- config/environments/development.rb
// https://myaccount.google.com/lesssecureapps
// https://accounts.google.com/DisplayUnlockCaptcha
// https://support.google.com/mail/answer/185833?hl=en

import { Google } from "arctic";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  "https://adidas-mocha.vercel.app/api/auth/callback/google",
);

//https://developers.google.com/oauthplayground/
