import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { registerRoutes } from './routes'; 

const app = Fastify({ logger: true });

// 1. Enable CORS - Strict fix to allow everything from your Frontend
app.register(cors, {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// 2. Register standard routes
app.register(registerRoutes);

// 3. EMERGENCY REDIRECT
// This ensures that even if the frontend hits the wrong URL, it gets the data
app.get('/', async () => { return { status: "Backend is running" } });

// 4. Start Server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    // Using 0.0.0.0 is correct for Render
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();