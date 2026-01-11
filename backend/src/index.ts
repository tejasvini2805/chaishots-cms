import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
// We import the specific function we created
import { registerRoutes } from './routes'; 

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

// 1. Register CORS (Allows Frontend to talk to Backend)
app.register(cors, {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// 2. Register Your Routes
app.register(registerRoutes);

// 3. Start Server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();