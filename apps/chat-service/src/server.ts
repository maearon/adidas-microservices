import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import roomRoutes from './routes/rooms';
import { initializeSocket } from './socket';

dotenv.config();

const app = express();
const server = createServer(app);
const prisma = new PrismaClient();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'https://adidas-clone.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
});

// Initialize socket handlers
initializeSocket(io, prisma);

// Routes
app.use('/api/rooms', roomRoutes);

// Health check
app.head('/health', (req: Request, res: Response) => {
  res.status(200).end();
});
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'chat-service'
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Adidas Chat Service',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      rooms: '/api/rooms',
      socket: '/socket.io'
    }
  });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`🚀 Chat service running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Process terminated');
  });
});
