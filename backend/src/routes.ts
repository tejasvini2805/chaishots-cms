import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerRoutes(app: FastifyInstance) {

  // --- NUCLEAR LOGIN: ALWAYS SAY YES ---
  app.post('/api/login', async (req: FastifyRequest, reply: FastifyReply) => {
    // We ignore the password check completely.
    // We ignore the email check completely.
    // We just hand over the keys.
    return { 
      token: 'emergency-access-token', 
      user: { email: 'admin@chaishots.com', role: 'ADMIN' } 
    };
  });

  // --- Create Programs ---
  app.post('/api/programs', async (req: FastifyRequest) => {
    const data = req.body as any;
    return await prisma.program.create({
      data: {
        title: data.title,
        description: data.description,
        status: "DRAFT",
        languagePrimary: "en",
        languagesAvailable: "en"
      }
    });
  });

  // --- Get Programs (For Admin Dashboard) ---
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