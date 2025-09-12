import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export const getServerSession = cache(async () => {
  console.log("getServerSession");
  return await auth.api.getSession({ headers: await headers() });
});
