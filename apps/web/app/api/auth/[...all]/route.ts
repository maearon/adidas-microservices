import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth.handler);

// xuất các method hay dùng (đặc biệt là GET, POST, OPTIONS nếu có preflight)
export { handler as GET, handler as POST, handler as OPTIONS };
