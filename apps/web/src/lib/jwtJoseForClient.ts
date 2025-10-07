// lib/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret"
);

interface JWTPayloadExtended extends JWTPayload {
  sub: string;
}

export async function generateJWT(
  payload: JWTPayloadExtended,
  expiresIn = "1h"
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS512" })
    .setIssuedAt()
    .setIssuer("http://localhost")
    .setAudience("http://localhost")
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<JWTPayloadExtended | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS512"],
      issuer: "http://localhost",
      audience: "http://localhost",
    });
    return payload as JWTPayloadExtended;
  } catch (err) {
    console.error("JWT verify failed:", err);
    return null;
  }
}
