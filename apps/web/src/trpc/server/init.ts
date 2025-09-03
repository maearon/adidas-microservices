import superjson from 'superjson';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';

import { db } from '@/db';
import { getSession } from '@/lib/auth';

export async function createTRPCContext({ req }: { req: Request }) {
  const url = new URL(req.url);

  // Query params (nếu cần)
  const token = url.searchParams.get("token");

  // Headers
  const authHeader = req.headers.get("authorization");

  // Cookies (nếu cần)
  const cookieHeader = req.headers.get("cookie");

  return {
    db,
    token,
    authHeader,
    cookieHeader,
    req, // nếu bạn cần pass xuống sâu hơn
  };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    const session = await getSession();

    if (!session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        user: session.user,
      },
    });
  })
);
