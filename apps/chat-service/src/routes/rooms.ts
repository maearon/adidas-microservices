import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    return next();
  });
};

// Get chat history for a room
router.get('/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const messages = await prisma.messages.findMany({
      where: { room_id: roomId },
      include: {
        users: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
    });

    const total = await prisma.messages.count({
      where: { room_id: roomId },
    });

    return res.json({
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// List active rooms
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rooms = await prisma.rooms.findMany({
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { last_message_at: 'desc' },
    });

    return res.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Create new room
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id, name, type = 'public' } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'Room id and name are required' });
    }

    const room = await prisma.rooms.create({
      data: { id, name, type },
    });

    return res.status(201).json({ room });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ error: 'Failed to create room' });
  }
});

export default router;
