import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types"
 
export default { providers: [Google] } satisfies NextAuthConfig
