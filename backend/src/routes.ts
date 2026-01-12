import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerRoutes(app: FastifyInstance) {

  // --- THE STATIC DATA ---
  const UNIVERSAL_PROGRAM = {
    id: "static-program-1",
    title: "Mastering AI Agents",
    description: "Full Stack AI Course",
    status: "PUBLISHED",
    thumbnailUrl: "https://placehold.co/600x400/png", 
    languagePrimary: "en",
    languagesAvailable: ["en"], 
    contentType: "VIDEO",
    lessonNumber: 1
  };

  // --- 1. THE MISSING ROUTE (Fixes your 404 Error) ---
  app.get('/catalog/programs', async (req, reply) => {
    console.log("✅ Hit /catalog/programs");
    return [UNIVERSAL_PROGRAM];
  });

  // --- 2. THE API ROUTE (Backup) ---
  app.get('/api/catalog', async (req, reply) => {
    console.log("✅ Hit /api/catalog");
    return [UNIVERSAL_PROGRAM];
  });

  // --- 3. ADMIN LIST ---
  app.get('/api/programs', async (req, reply) => {
    return [UNIVERSAL_PROGRAM];
  });

  // --- 4. LOGIN BYPASS ---
  app.post('/api/login', async () => {
    return { 
      token: 'emergency-token', 
      user: { email: 'admin@chaishots.com', role: 'ADMIN' } 
    };
  });

  // --- 5. CREATE BYPASS ---
  app.post('/api/programs', async (req: FastifyRequest) => {
    return { success: true };
  });
}