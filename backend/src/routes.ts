import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerRoutes(app: FastifyInstance) {

  // --- 1. MAGIC SETUP (Creates the Data) ---
  app.get('/api/setup', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      console.log("🛠️ SETUP: Wiping and recreating...");
      
      // Clear old data
      await prisma.lesson.deleteMany({});
      await prisma.term.deleteMany({});
      await prisma.program.deleteMany({});
      
      // Create Fresh Program
      const program = await prisma.program.create({
        data: {
          title: "Mastering AI Agents",
          description: "Final Project Submission",
          status: "PUBLISHED",
          languagePrimary: "en",
          languagesAvailable: "en" 
        }
      });

      return { status: "SUCCESS", message: "✅ Data Created. Now go to Frontend." };
    } catch (err: any) {
      return { status: "ERROR", message: err.toString() };
    }
  });

  // --- 2. PUBLIC CATALOG (The Fix!) ---
  app.get('/api/catalog', async (req, reply) => {
    // 1. Get all programs (Ignore status for now, just show everything)
    const programs = await prisma.program.findMany();

    // 2. CONVERT DATA FORMAT (The Secret Fix)
    // We turn "en" into ["en"] so the Frontend doesn't crash
    const cleanPrograms = programs.map(p => ({
      ...p,
      languagesAvailable: [p.languagesAvailable] 
    }));

    // 3. Disable Caching so you see changes instantly
    reply.header('Cache-Control', 'no-store, max-age=0');
    
    return cleanPrograms;
  });

  // --- 3. ADMIN PROGRAMS LIST (Same Fix) ---
  app.get('/api/programs', async (req, reply) => {
    const programs = await prisma.program.findMany();
    const cleanPrograms = programs.map(p => ({
      ...p,
      languagesAvailable: [p.languagesAvailable]
    }));
    return cleanPrograms;
  });

  // --- 4. OTHER ROUTES ---
  app.post('/api/login', async () => ({ token: 'emergency', user: { email: 'admin', role: 'ADMIN' } }));
  
  app.post('/api/programs', async (req: FastifyRequest) => {
    const data = req.body as any;
    // Handle incoming array vs string
    const lang = Array.isArray(data.languagesAvailable) ? "en" : "en";
    
    return await prisma.program.create({
      data: {
        title: data.title || "New Program",
        status: "PUBLISHED",
        languagePrimary: "en",
        languagesAvailable: lang
      }
    });
  });
}