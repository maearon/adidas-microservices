import { Server, Socket } from 'socket.io';
import { Prisma, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import md5 from "blueimp-md5";
import { randomUUID } from 'crypto';
import { db } from "@/db";
import { user as users } from "@/db/schema"; // 👉 đổi alias cho rõ ràng
import { eq } from "drizzle-orm";

export const getGravatarUrl = (email: string, size = 50): string => {
  const hash = md5(email.trim().toLowerCase());
  return `https://secure.gravatar.com/avatar/${hash}?s=${size}`;
};

enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE'
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string | null;
}

interface JoinRoomData {
  roomId: string;
}

interface MessageData {
  roomId: string;
  content: string;
  is_ai?: boolean;
  type?: 'text' | 'image' | 'file';
}

interface LeaveRoomData {
  roomId: string;
}

// interface ServerToClientEvents {
//   message_history: (data: { roomId: string; messages: any[] }) => void;
//   user_joined: (data: { userId: string; userEmail?: string | null; roomId: string }) => void;
//   new_message: (data: {
//     id: string;
//     content: string;
//     type: string;
//     roomId: string;
//     users: { id: string; name: string | null; email: string | null; avatar: string };
//     createdAt: Date;
//     is_ai: boolean;
//     isBot: boolean;
//   }) => void;
//   user_typing: (data: { userId?: string; userEmail?: string | null; isTyping: boolean }) => void;
//   user_left: (data: { userId?: string; userEmail?: string | null; roomId: string }) => void;
//   error: (data: { message: string }) => void;
// }

// interface ClientToServerEvents {
//   join_room: (data: JoinRoomData) => void;
//   leave_room: (data: LeaveRoomData) => void;
//   message: (data: MessageData) => void;
//   typing: (data: { roomId: string; isTyping: boolean }) => void;
// }

// interface Message {
//   id: string;
//   content: string;
//   type: keyof typeof MessageType;
//   room_id: string;
//   user_id: string;
//   created_at: Date;
//   is_ai?: boolean;
// }

export function initializeSocket(
  io: Server,
  prisma: PrismaClient
) {
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token =
        (socket.handshake.query.token as string) ||
        socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) return next(new Error('Authentication token required'));

      interface JWTPayload {
        sub: string;
        email?: string;
        exp?: number;
        iat?: number;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

      if (!decoded?.sub) return next(new Error("Invalid token payload"));

      // const user = await prisma.users.findUnique({
      //   where: { id: decoded.sub },
      // });

      const userResult = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          emailVerified: users.emailVerified, // cột trong better-auth
        })
        .from(users)
        .where(eq(users.id, decoded.sub))
        .limit(1);

      const user = userResult[0];

      if (!user) {
        return next(new Error('User not found from token sub'));
      }

      socket.userId = user.id;
      socket.userEmail = user.email;

      console.log(`✅ User authenticated: ${user.email} (${user.id})`);
      return next();
    } catch (error) {
      console.error('❌ Socket authentication failed:', error);
      return next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔌 User connected: ${socket.userEmail} (${socket.id})`);

    socket.on('join_room', async ({ roomId }: JoinRoomData) => {
      try {
        let room = await prisma.rooms.findUnique({ where: { id: roomId } });
        if (!room) {
          room = await prisma.rooms.create({
            data: {
              id: roomId,
              name: roomId,
              type: 'public',
            },
          });
        }

        socket.join(roomId);

        // ❌ Bỏ include users (Prisma không có bảng users)
        const messages = await prisma.messages.findMany({
          where: { room_id: roomId },
          // include: { users: { select: { id: true, name: true, email: true } } },
          orderBy: { created_at: 'desc' },
          take: 50,
        });

        // ✅ Map messages và attach user info từ drizzle
        const enrichedMessages = await Promise.all(
          messages.map(async (msg: any) => {
            const [user] = await db
              .select({
                id: users.id,
                name: users.name,
                email: users.email,
              })
              .from(users)
              .where(eq(users.id, msg.user_id))
              .limit(1);

            return {
              ...msg,
              users: user
                ? {
                    ...user,
                    avatar: getGravatarUrl(user.email ?? "default@example.com"),
                  }
                : null,
            };
          })
        );

        socket.emit('message_history', {
          roomId,
          messages: enrichedMessages.reverse(),
        });

        socket.to(roomId).emit('user_joined', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          roomId,
        });

        console.log(`👥 User ${socket.userEmail} joined room: ${roomId}`);
        return;
      } catch (error) {
        console.error('❌ Error joining room:', error);
        return socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('message', async ({ roomId, content, is_ai, type = 'text' }: MessageData) => {
      try {
        if (!content?.trim()) {
          return socket.emit('error', { message: 'Message content is required' });
        }

        const prismaType = (type?.toUpperCase() as keyof typeof MessageType) || 'TEXT';

        const message = await prisma.messages.create({
          data: {
            id: randomUUID(),
            content: content.trim(),
            type: MessageType[prismaType],
            room_id: roomId,
            // user_id: socket.userId!,
            user_id: 'YnhAyaqjpK7Z7SCs0FWO1M2CuhSBhD1h',
            is_ai: !!is_ai, // 👇 thêm dòng này
          },
          // include: {
          //   users: {
          //     select: { id: true, name: true, email: true },
          //   },
          // },
        });

        await prisma.rooms.update({
          where: { id: roomId },
          data: {
            last_message_at: new Date(),
            last_message: content.trim(),
          },
        });

        // Lấy user từ drizzle (1 query)
        const [user] = await db
          .select({ id: users.id, name: users.name, email: users.email })
          .from(users)
          .where(eq(users.id, socket.userId!))
          .limit(1);

        const avatarUrl = getGravatarUrl(user?.email ?? 'default@example.com');

        io.to(roomId).emit('new_message', {
          id: message.id,
          content: message.content,
          type: message.type,
          roomId: message.room_id,
          users: {
            ...user,
            avatar: avatarUrl,
          },
          createdAt: message.created_at,
          is_ai: message.is_ai,   // 👈 thêm dòng này
          isBot: message.is_ai,   // (tuỳ, giữ để backward-compat)
        });

        console.log(`💬 Message sent in ${roomId} by ${socket.userEmail}`);
        return;
      } catch (error) {
        console.error('❌ Error sending message:', error);
        return socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', ({ roomId, isTyping }: { roomId: string; isTyping: boolean }) => {
      socket.to(roomId).emit('user_typing', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        isTyping,
      });
      return;
    });

    socket.on('leave_room', async ({ roomId }: LeaveRoomData) => {
      try {
        socket.leave(roomId);
        socket.to(roomId).emit('user_left', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          roomId,
        });

        console.log(`👋 User ${socket.userEmail} left room: ${roomId}`);
        return;
      } catch (error) {
        console.error('❌ Error leaving room:', error);
        return;
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.userEmail} (${socket.id})`);
      return;
    });
  });
}
