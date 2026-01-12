import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerRoutes(app: FastifyInstance) {

  // --- THE MAGIC SETUP ROUTE ---
  // Visit this link to force-create the course
  app.get('/api/setup', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      console.log("🛠️ Starting Manual Setup...");

      // 1. WIPE OLD DATA (To prevent conflicts)
      await prisma.lesson.deleteMany({});
      await prisma.term.deleteMany({});
      await prisma.program.deleteMany({});
      
      // 2. CREATE PROGRAM
      const program = await prisma.program.create({
        data: {
          title: "Mastering AI Agents",
          description: "Full Stack AI Course",
          status: "DRAFT",
          languagePrimary: "en",
          languagesAvailable: "en" 
        }
      });

      // 3. CREATE TERM
      const term = await prisma.term.create({
        data: {
          title: "Term 1: Foundations",
          termNumber: 1,
          programId: program.id
        }
      });

      // 4. CREATE PUBLISHED LESSON
      await prisma.lesson.create({
        data: {
          title: "Introduction to Agents",
          lessonNumber: 1,
          status: "PUBLISHED", // <--- CRITICAL
          termId: term.id,
          contentUrls: "{}",
          subtitleUrls: "{}",
          contentType: "VIDEO",
          contentLanguagePrimary: "en"
        }
      });

      return { status: "SUCCESS", message: "✅ Course Created! Go refresh your frontend." };

    } catch (err: any) {
      console.error(err);
      return { status: "ERROR", message: err.toString() };
    }
  });

  // --- KEEP EXISTING ROUTES ---
  app.post('/api/login', async () => ({ token: 'emergency', user: { email: 'admin', role: 'ADMIN' } }));
  
  app.post('/api/programs', async (req: FastifyRequest) => {
    const data = req.body as any;
    return await prisma.program.create({
      data: {
        title: data.title || "New Program",
        status: "DRAFT",
        languagePrimary: "en",
        languagesAvailable: "en"
      }
    });
  });

  app.get('/api/programs', async () => await prisma.program.findMany());
  
  app.get('/api/catalog', async () => {
    return await prisma.lesson.findMany({
      where: { status: 'PUBLISHED' },
      include: { term: { include: { program: true } } }
    });
  });
}