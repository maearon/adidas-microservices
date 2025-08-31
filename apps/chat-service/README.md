# 💬 Adidas Chat Service

A real-time chat service built with Node.js, Express, Socket.IO, and PostgreSQL for the Adidas platform.

## 🚀 Features

- **Real-time messaging** with Socket.IO
- **JWT Authentication** for secure connections
- **PostgreSQL database** with Prisma ORM
- **Room-based chat system**
- **REST API** for chat history and room management
- **Docker support** for easy deployment
- **Render deployment ready**

## 📦 Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Real-time**: Socket.IO
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT
- **Deployment**: Docker + Render

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Installation

```
ALTER TABLE messages 
ADD COLUMN is_ai BOOLEAN DEFAULT FALSE;
npx prisma introspect
PS C:\Users\manhn\code\shop-php\apps\chat-service\prisma> npx prisma generate
Environment variables loaded from ..\.env
Prisma schema loaded from schema.prisma

✔ Generated Prisma Client (v5.22.0) to .\..\node_modules\@prisma\client in 501ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)

Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints

┌─────────────────────────────────────────────────────────┐
│  Update available 5.22.0 -> 6.11.1                      │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘
```

\`\`\`bash
# Clone and setup
git clone <repository>
cd chat-service

# Install dependencies
make install
# or
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL and JWT secret
\`\`\`

### 2. Database Setup

\`\`\`bash
# Generate Prisma client
make generate

# Run migrations
make migrate

# Seed sample data
make seed
\`\`\`

### 3. Development

\`\`\`bash
# Start development server
make dev
# or
npm run dev

# Server will start on http://localhost:3002
\`\`\`

### 4. Docker (Alternative)

\`\`\`bash
# Start with Docker Compose
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
\`\`\`

## 🌐 API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/rooms` - List active rooms
- `GET /api/rooms/:roomId/messages` - Get chat history
- `POST /api/rooms` - Create new room

### WebSocket Events

**Client → Server:**
- `join_room` - Join a chat room
- `message` - Send a message
- `leave_room` - Leave a room
- `typing` - Typing indicator

**Server → Client:**
- `message_history` - Chat history when joining
- `new_message` - New message broadcast
- `user_joined` - User joined room
- `user_left` - User left room
- `user_typing` - Typing indicator

## 🔐 Authentication

The service uses JWT tokens for authentication. Include the token in:

1. **Socket.IO connection**: `?token=your_jwt_token`
2. **REST API**: `Authorization: Bearer your_jwt_token`

## 🚀 Deployment to Render

### 1. Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name**: `adidas-chat-service`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 2. Environment Variables

Add these environment variables in Render:

\`\`\`env
DATABASE_URL=postgres://default:z9GYTlrXa8Qx@ep-bold-voice-a4yp8xc9-pooler.us-east-1.aws.neon.tech/verceldb?pgbouncer=true&connect_timeout=15&sslmode=require
JWT_SECRET=your-super-secure-jwt-secret-here
CORS_ORIGIN=https://your-frontend-domain.com
PORT=3002
NODE_ENV=production
\`\`\`

### 3. Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Your service will be available at: `https://your-service-name.onrender.com`

### 4. Run Migrations

After deployment, run migrations:

\`\`\`bash
# In Render console or locally with production DATABASE_URL
npx prisma migrate deploy
\`\`\`

## 🔌 Frontend Integration

### Next.js Integration

Install Socket.IO client:

\`\`\`bash
npm install socket.io-client
\`\`\`

Update your `chat-widget.tsx`:

\`\`\`typescript
import { io, Socket } from 'socket.io-client';

// Initialize socket connection
const socket = io('https://your-chat-service.onrender.com', {
  query: { token: userToken },
  transports: ['websocket', 'polling']
});

// Join room
socket.emit('join_room', { roomId: 'general' });

// Send message
socket.emit('message', { 
  roomId: 'general', 
  content: 'Hello!',
  type: 'text'
});

// Listen for messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
\`\`\`

## 📁 Project Structure

\`\`\`
chat-service/
├── src/
│   ├── server.ts          # Express server setup
│   ├── socket.ts          # Socket.IO handlers
│   └── routes/
│       └── rooms.ts       # REST API routes
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Local development
├── Makefile             # Development commands
└── README.md            # This file
\`\`\`

## 🧪 Testing

\`\`\`bash
# Test health endpoint
curl http://localhost:3002/health

# Test with authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3002/api/rooms
\`\`\`

## 🔧 Development Commands

\`\`\`bash
make help          # Show all available commands
make dev           # Start development server
make build         # Build for production
make migrate       # Run database migrations
make seed          # Seed database
make docker-up     # Start with Docker
make clean         # Clean build artifacts
\`\`\`

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Run `make migrate` to setup tables

2. **Socket.IO connection failed**
   - Check CORS_ORIGIN configuration
   - Verify JWT token is valid
   - Check network connectivity

3. **Authentication errors**
   - Verify JWT_SECRET matches between services
   - Check token expiration
   - Ensure token format is correct

### Logs

\`\`\`bash
# Docker logs
make docker-logs

# Production logs (Render)
# Check Render dashboard logs section
\`\`\`

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

---

**Made with ❤️ for Adidas Platform**
\`\`\`

Now, here's exactly what you need to modify in your existing `chat-widget.tsx` to make it work with the real chat service:

```typescriptreact file="components/chat-widget.tsx"
[v0-no-op-code-block-prefix]"use client"
...
```
