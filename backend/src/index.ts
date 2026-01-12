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

// --- AUTO-PILOT: FINAL CLOUD FIX ---
async function seedDatabase() {
  try {
    console.log("🌱 Auto-Pilot: Checking for content...");

    // 1. Create (or find) the Program
    let program = await prisma.program.findFirst({ where: { title: "Mastering AI Agents" } });
    
    if (!program) {
      console.log("Creating Program...");
      program = await prisma.program.create({
        data: {
          title: "Mastering AI Agents",
          description: "Full Stack AI Course",
          status: "DRAFT",
          languagePrimary: "en",
          languagesAvailable: "en" // <--- CHANGED BACK TO STRING (Cloud Requirement)
        }
      });
    }

    // 2. Create (or find) the Term
    let term = await prisma.term.findFirst({ where: { programId: program.id } });
    if (!term) {
      console.log("Creating Term...");
      term = await prisma.term.create({
        data: {
          title: "Term 1: Foundations",
          termNumber: 1,
          programId: program.id
        }
      });
    }

    // 3. FORCE CREATE A PUBLISHED LESSON
    const existingLesson = await prisma.lesson.findFirst({ where: { termId: term.id } });
    if (!existingLesson) {
      console.log("Creating PUBLISHED Lesson...");
      await prisma.lesson.create({
        data: {
          title: "Introduction to Agents",
          lessonNumber: 1,
          status: "PUBLISHED", 
          termId: term.id,
          contentUrls: "{}",
          subtitleUrls: "{}",
          contentType: "VIDEO",       // Kept this
          contentLanguagePrimary: "en" // Kept this
        }
      });
      console.log("✅ SUCCESS: Lesson Created and Published!");
    } else {
      console.log("👍 Content already exists.");
    }

  } catch (err) {
    console.error("Auto-Pilot Error:", err);
  }
}

// 3. Start Server
const start = async () => {
  try {
    // Run the Auto-Pilot BEFORE listening
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