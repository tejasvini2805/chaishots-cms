import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function runScheduler() {
  console.log('👷 Worker started: Checking for scheduled lessons...');
  
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Find lessons that are SCHEDULED and past their time
      const toPublish = await prisma.lesson.findMany({
        where: {
          status: 'SCHEDULED',
          publishAt: {
            lte: now // "Less than or equal to" now
          }
        }
      });

      if (toPublish.length > 0) {
        console.log(`⏰ Found ${toPublish.length} lessons to publish.`);
        
        for (const lesson of toPublish) {
          await prisma.lesson.update({
            where: { id: lesson.id },
            data: { 
              status: 'PUBLISHED',
              publishedAt: now
            }
          });
          console.log(`   -> Published Lesson: ${lesson.title}`);
        }
      }
    } catch (err) {
      console.error('Scheduler Error:', err);
    }
  }, 60000); // Run every 60 seconds
}