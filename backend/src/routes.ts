import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerRoutes(app: FastifyInstance) {

  // --- THE NUCLEAR DATA OBJECT ---
  // We include every possible array to prevent .map() crashes
  const UNIVERSAL_PROGRAM = {
    id: "static-program-1",
    title: "Mastering AI Agents (FINAL)", // <--- Look for this title change!
    description: "Full Stack AI Course",
    status: "PUBLISHED",
    thumbnailUrl: "https://placehold.co/600x400/png", 
    languagePrimary: "en",
    
    // --- 1. STRING ARRAYS ---
    languagesAvailable: ["en"], 
    tags: ["AI", "Tech", "Future"],
    outcomes: ["Build Agents", "Deploy Models", "Master TypeScript"],
    requirements: ["Basic JavaScript Knowledge"],
    categories: ["Technology"],
    
    // --- 2. OBJECT ARRAYS (Complex Lists) ---
    authors: [
      { id: "auth-1", name: "Admin User", avatarUrl: "https://placehold.co/50x50" }
    ],
    prices: [],       // Just in case it looks for pricing
    enrollments: [],  // Just in case it looks for students
    
    // --- 3. CONTENT HIERARCHY ---
    terms: [
      {
        id: "term-1",
        title: "Term 1: Foundations",
        description: "Getting started with AI",
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction to Agents",
            status: "PUBLISHED",
            contentType: "VIDEO",
            contentUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            description: "Intro video",
            duration: 120
          }
        ]
      }
    ],
    
    // --- 4. FALLBACKS ---
    lessons: [] // Some frontends look for lessons at the root level
  };

  // --- HELPER: FORCE NO CACHE ---
  const sendData = (reply: FastifyReply, data: any) => {
    // This forces the browser to download fresh data every time
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');
    return data;
  };

  // --- ROUTES ---

  // 1. Catalog Program Details (The likely crasher)
  app.get('/catalog/programs', async (req, reply) => {
    console.log("✅ Serving /catalog/programs");
    return sendData(reply, [UNIVERSAL_PROGRAM]);
  });

  // 2. API Catalog
  app.get('/api/catalog', async (req, reply) => {
    console.log("✅ Serving /api/catalog");
    return sendData(reply, [UNIVERSAL_PROGRAM]);
  });

  // 3. Admin List
  app.get('/api/programs', async (req, reply) => {
    return sendData(reply, [UNIVERSAL_PROGRAM]);
  });

  // 4. Bypasses
  app.post('/api/login', async () => ({ token: 'emergency', user: { email: 'admin', role: 'ADMIN' } }));
  app.post('/api/programs', async () => ({ success: true }));
}