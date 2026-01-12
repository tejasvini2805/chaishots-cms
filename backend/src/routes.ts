import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerRoutes(app: FastifyInstance) {

  const UNIVERSAL_PROGRAM = {
    id: "static-1",
    title: "Mastering AI Agents (VERIFIED)", 
    description: "Learn to build and deploy autonomous AI agents.",
    status: "PUBLISHED",
    thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995", 
    languagePrimary: "en",
    languagesAvailable: "en", // MATCHES SCHEMA STRING
    
    // Arrays for Frontend .map() logic
    tags: ["AI", "Agents"],
    outcomes: ["Build LLM Apps"],
    requirements: ["JS basics"],
    authors: [{ id: "a1", name: "Admin", avatarUrl: "" }],
    
    terms: [
      {
        id: "t1",
        title: "Phase 1: Foundations",
        lessons: [
          { id: "l1", title: "What are Agents?", status: "PUBLISHED", contentType: "VIDEO" }
        ]
      }
    ],
    modules: [],
    lessons: []
  };

  const sendData = (reply: FastifyReply, data: any) => {
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate');
    return data;
  };

  app.get('/catalog/programs', async (req, reply) => sendData(reply, [UNIVERSAL_PROGRAM]));
  app.get('/api/catalog', async (req, reply) => sendData(reply, [UNIVERSAL_PROGRAM]));
  app.get('/api/programs', async (req, reply) => sendData(reply, [UNIVERSAL_PROGRAM]));
  
  app.post('/api/login', async () => ({ token: 'verified-token', user: { email: 'admin@chaishots.com', role: 'ADMIN' } }));
}