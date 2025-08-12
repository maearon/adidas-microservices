ALTER TABLE users
ADD COLUMN "emailVerified" BOOLEAN DEFAULT FALSE,
ADD COLUMN image TEXT;

ALTER TABLE sessions
ADD COLUMN token TEXT DEFAULT '234abc' NOT NULL;
ADD COLUMN "createdAt" TIMESTAMP NOT NULL,
ADD COLUMN "updatedAt" TIMESTAMP NOT NULL,
ADD COLUMN "ipAddress" TEXT,
ADD COLUMN "userAgent" TEXT;

ALTER TABLE "Account"
ADD COLUMN "accountId" TEXT NOT NULL,
ADD COLUMN "providerId" TEXT NOT NULL,
ADD COLUMN "accessToken" TEXT,
ADD COLUMN "refreshToken" TEXT,
ADD COLUMN "idToken" TEXT,
ADD COLUMN "accessTokenExpiresAt" TIMESTAMP,
ADD COLUMN "refreshTokenExpiresAt" TIMESTAMP,
ADD COLUMN "password" TEXT,
ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW();

CREATE TABLE verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);


-- Failed query:
-- -- CreateTable: user
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable: session
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "user_email_key" ON "user" ("email");
CREATE UNIQUE INDEX "session_token_key" ON "session" ("token");

-- Foreign keys
ALTER TABLE "session"
ADD CONSTRAINT "session_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user" ("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Nếu bảng account đã tồn tại nhưng chưa có FK thì thêm:
ALTER TABLE "Account"
ADD CONSTRAINT "account_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user" ("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- 1. Xóa ràng buộc cũ
ALTER TABLE "Account"
DROP CONSTRAINT "account_userId_fkey";

-- 2. Tạo ràng buộc mới trỏ về bảng "user"
ALTER TABLE "Account"
ADD CONSTRAINT "account_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user" ("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
