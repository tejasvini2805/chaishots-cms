import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { registerRoutes } from './routes';
import { runScheduler } from './services/scheduler';
import bcrypt from 'bcrypt'; // Make sure this is imported

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

// Register CORS
app.register(cors, {
  origin: true, // Allow all origins for simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Register API Routes
app.register(registerRoutes);

// --- AUTO-SEED SCRIPT ---
async function seedAdminUser() {
  const email = 'admin@chaishots.com';
  console.log(`Checking for admin user: ${email}...`);
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      console.log('Admin user not found. Creating now...');
      // Hash password "123456"
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      await prisma.user.create({
        data: {
          email,
          name: 'Super Admin',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('👍 Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

// Start Server
const start = async () => {
  try {
    // 1. Run the Auto-Seed
    await seedAdminUser();

    // 2. Start the Server
    const port = parseInt(process.env.PORT || '3000');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running at http://localhost:${port}`);

    // 3. Start the Scheduler
    runScheduler();

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();