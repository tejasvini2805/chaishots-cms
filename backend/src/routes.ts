import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerRoutes(app: FastifyInstance) {

  // --- NUCLEAR LOGIN: ALWAYS SAY YES ---
  app.post('/api/login', async (req: FastifyRequest, reply: FastifyReply) => {
    return { 
      token: 'emergency-access-token', 
      user: { email: 'admin@chaishots.com', role: 'ADMIN' } 
    };
  });

  // --- SAFE CREATE PROGRAM (Fixes the "Click" issue) ---
  app.post('/api/programs', async (req: FastifyRequest) => {
    const data = req.body as any;

    // FIX: Convert complex lists into simple strings so SQLite doesn't crash
    const langAvailable = Array.isArray(data.languagesAvailable) 
      ? data.languagesAvailable.join(',') 
      : "en";

    return await prisma.program.create({
      data: {
        title: data.title || "New Program",
        description: data.description || "",
        status: "DRAFT",
        languagePrimary: "en",
        languagesAvailable: langAvailable // <--- The fix is here
      }
    });
  });

  // --- Get Programs ---
  app.get('/api/programs', async () => {
    return await prisma.program.findMany();
  });
  
  // --- Public Catalog ---
  app.get('/api/catalog', async () => {
    return await prisma.lesson.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        term: {
          include: { program: true }
        }
      }
    });
  });
}