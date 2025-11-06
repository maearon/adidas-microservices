import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

/**
 * Get user ID from better auth session
 * Returns null if user is not authenticated
 */
export async function getUserFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user?.id || null;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

/**
 * Get user from request and throw error if not authenticated
 */
export async function requireUserFromRequest(req: NextRequest): Promise<string> {
  const userId = await getUserFromRequest(req);
  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }
  return userId;
}

