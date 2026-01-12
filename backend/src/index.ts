import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './routes'; 

const app = Fastify({ logger: true });

// Enable CORS for frontend-backend communication
app.register(cors, {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(registerRoutes);

const start = async () => {
  try {
    // Render requires the app to listen on port 10000
    const port = parseInt(process.env.PORT || '10000');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Backend Live on Port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();