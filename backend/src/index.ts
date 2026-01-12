import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { registerRoutes } from './routes';

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

// 1. Enable CORS
app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// 2. Register Routes
app.register(registerRoutes);

// --- AUTO-PILOT SCRIPT: CREATE COURSE & CONTENT ---
async function seedDatabase() {
  try {
    // Check if we already have the course to avoid duplicates
    const existing = await prisma.program.findFirst({
      where: { title: "Mastering AI Agents" }
    });

    if (!existing) {
      console.log("🌱 Auto-Pilot: Creating Course Content...");

      // 1. Create Program
      const program = await prisma.program.create({
        data: {
          title: "Mastering AI Agents",
          description: "Full Stack AI Course",
          status: "DRAFT",
          languagePrimary: "en",
          languagesAvailable: "en"
        }
      });

      // 2. Create Term
      const term = await prisma.term.create({
        data: {
          title: "Term 1: Foundations",
          termNumber: 1,
          programId: program.id
        }
      });

      // 3. Create PUBLISHED Lesson (This makes it show up public!)
      await prisma.lesson.create({
        data: {
          title: "Introduction to Agents",
          description: "Welcome to the future of AI.",
          lessonNumber: 1,
          status: "PUBLISHED", // <--- CRITICAL
          termId: term.id,
          contentUrls: "{}",
          subtitleUrls: "{}"
        }
      });

      console.log("✅ Auto-Pilot: Content Created Successfully!");
    } else {
      console.log("👍 Auto-Pilot: Content already exists.");
    }
  } catch (err) {
    console.error("Auto-Pilot Error:", err);
  }
}

// 3. Start Server
const start = async () => {
  try {
    // Run the Auto-Pilot before starting
    await seedDatabase();

    const port = parseInt(process.env.PORT || '3000');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();