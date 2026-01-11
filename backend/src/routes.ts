import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// NOTICE: We are using "export async function" here
export async function registerRoutes(app: FastifyInstance) {

  // --- Login Route ---
  app.post('/api/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = req.body as any;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    return { token: 'fake-jwt-token', user: { email: user.email, role: user.role } };
  });

  // --- CRUD for Programs ---
  app.get('/api/programs', async () => {
    return await prisma.program.findMany();
  });

  app.post('/api/programs', async (req: FastifyRequest) => {
    const data = req.body as any;
    return await prisma.program.create({
      data: {
        title: data.title,
        description: data.description,
        status: "DRAFT", // Default for now
        languagePrimary: "en",
        languagesAvailable: "en"
      }
    });
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