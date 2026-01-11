import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Cleanup existing data
  await prisma.lessonAsset.deleteMany()
  await prisma.programAsset.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.term.deleteMany()
  await prisma.program.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Admin User (for CMS Login later)
  await prisma.user.create({
    data: {
      email: 'admin@chaishots.com',
      password: 'hashed_password_placeholder', // We will fix hashing in API step
      role: 'ADMIN'
    }
  })

  // 2. Create Program 1 (Telugu & English)
  const prog1 = await prisma.program.create({
    data: {
      title: 'Mastering AI Agents',
      description: 'Learn to build autonomous agents from scratch.',
      languagePrimary: 'te',
      languagesAvailable: ['te', 'en'],
      status: 'DRAFT', // Will auto-publish when lesson publishes
      assets: {
        create: [
          { language: 'te', variant: 'PORTRAIT', url: 'https://via.placeholder.com/600x800', assetType: 'POSTER' },
          { language: 'te', variant: 'LANDSCAPE', url: 'https://via.placeholder.com/800x600', assetType: 'POSTER' }
        ]
      }
    }
  })

  // 3. Create Term
  const term1 = await prisma.term.create({
    data: {
      programId: prog1.id,
      termNumber: 1,
      title: 'Foundations'
    }
  })

  // 4. Create Lesson 1: PUBLISHED (Immediate)
  await prisma.lesson.create({
    data: {
      termId: term1.id,
      lessonNumber: 1,
      title: 'Introduction to LLMs',
      contentType: 'VIDEO',
      durationMs: 600000,
      contentLanguagePrimary: 'te',
      contentLanguagesAvailable: ['te', 'en'],
      contentUrls: { te: 'http://video-te.mp4', en: 'http://video-en.mp4' },
      status: 'PUBLISHED',
      publishedAt: new Date(),
    }
  })

  // 5. Create Lesson 2: SCHEDULED (The Demo Requirement)
  // Scheduled for 2 minutes from NOW. 
  // We will use this to test the Worker in the next step.
  const scheduleTime = new Date(Date.now() + 1000 * 120); // 2 mins later
  
  await prisma.lesson.create({
    data: {
      termId: term1.id,
      lessonNumber: 2,
      title: 'Prompt Engineering Basics',
      contentType: 'ARTICLE',
      contentLanguagePrimary: 'te',
      contentLanguagesAvailable: ['te'],
      contentUrls: { te: 'http://article-te.pdf' },
      status: 'SCHEDULED',
      publishAt: scheduleTime
    }
  })

  console.log(`Seeding finished. Created Scheduled Lesson for: ${scheduleTime.toISOString()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })