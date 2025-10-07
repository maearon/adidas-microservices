import jwt from "jsonwebtoken";

const SECRET = (process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret") as jwt.Secret; 
// ép kiểu rõ ràng để TypeScript không báo lỗi

interface JWTPayload {
  sub: string;
  iss?: string;
  aud?: string[];
  iat?: number;
  exp?: number;
}

export function generateJWT(payload: JWTPayload, expiresIn: string | number = "1h") {
  const fullPayload: JWTPayload = {
    iss: "http://localhost",
    aud: ["http://localhost"],
    iat: Math.floor(Date.now() / 1000),
    ...payload,
  };

  return jwt.sign(fullPayload, SECRET, {
    algorithm: "HS512",
    expiresIn,
  });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, SECRET, {
    algorithms: ["HS512"],
    issuer: "http://localhost",
    audience: ["http://localhost"],
  });
}
