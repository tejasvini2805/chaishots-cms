import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './routes'; 

const app = Fastify({ logger: true });

// 1. Enable CORS (Critical for Frontend-to-Backend communication)
app.register(cors, {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// 2. Register your Routes
app.register(registerRoutes);

// 3. Start Server on Port 10000 (Required for Render)
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '10000');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Backend Live on Port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();