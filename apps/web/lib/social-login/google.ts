// apps/web/lib/social-login/google.ts 
// https://console.cloud.google.com/apis/credentials?inv=1&invt=Ab4c6w&project=shop-php-463700

import { Google } from "arctic";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.PUBLIC_BASE_URL}/api/auth/callback/google`,
);

google.scopes = ['openid', 'email', 'profile'];
