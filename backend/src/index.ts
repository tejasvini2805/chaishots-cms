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

// --- AUTO-PILOT: FORCE FIX ---
async function seedDatabase() {
  try {
    console.log("🌱 Auto-Pilot: Starting...");

    // 1. CLEAN UP: Delete the old program to avoid "Bad Data" issues
    // We use a try-catch block here in case it doesn't exist yet
    try {
      const old = await prisma.program.findFirst({ where: { title: "Mastering AI Agents" } });
      if (old) {
        console.log("Cleaning up old data...");
        // We delete the lessons and terms first to avoid foreign key errors
        await prisma.lesson.deleteMany({ where: { term: { programId: old.id } } });
        await prisma.term.deleteMany({ where: { programId: old.id } });
        await prisma.program.delete({ where: { id: old.id } });
      }
    } catch (e) {
      console.log("Cleanup skipped (fresh start).");
    }

    console.log("Creating Fresh Content...");

    // 2. Create Program (Using 'as any' to bypass the Type Error)
    const program = await prisma.program.create({
      data: {
        title: "Mastering AI Agents",
        description: "Full Stack AI Course",
        status: "DRAFT",
        languagePrimary: "en",
        // FORCE FIX: We cast this to 'any' so it works on both Local and Cloud
        languagesAvailable: "en" as any 
      }
    });

    // 3. Create Term
    const term = await prisma.term.create({
      data: {
        title: "Term 1: Foundations",
        termNumber: 1,
        programId: program.id
      }
    });

    // 4. Create PUBLISHED Lesson
    await prisma.lesson.create({
      data: {
        title: "Introduction to Agents",
        lessonNumber: 1,
        status: "PUBLISHED", // <--- Visible to Public
        termId: term.id,
        contentUrls: "{}",
        subtitleUrls: "{}",
        contentType: "VIDEO",
        contentLanguagePrimary: "en"
      }
    });
    
    console.log("✅ SUCCESS: Content Created!");

  } catch (err) {
    console.error("Auto-Pilot Error:", err);
  }
}

// 3. Start Server
const start = async () => {
  try {
    // Run the Auto-Pilot
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