import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Chuyển handler của better-auth thành handler cho Next.js App Router
const handler = toNextJsHandler(auth.handler);

// Export tất cả method cần hỗ trợ
export { 
  handler as GET, 
  handler as POST, 
  handler as PUT, 
  handler as PATCH,
  handler as DELETE, 
  handler as OPTIONS,
  handler as HEAD 
};
