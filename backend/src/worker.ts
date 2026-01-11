import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function runWorker() {
  console.log('👷 Worker started: Checking for scheduled lessons...')

  // This loop runs every 60 seconds
  setInterval(async () => {
    try {
      const now = new Date()

      // 1. Find lessons that are SCHEDULED and ready to publish
      const lessonsToPublish = await prisma.lesson.findMany({
        where: {
          status: 'SCHEDULED',
          publishAt: {
            lte: now // "Less than or equal to" now
          }
        }
      })

      if (lessonsToPublish.length > 0) {
        console.log(`⏰ Found ${lessonsToPublish.length} lessons to publish.`)

        for (const lesson of lessonsToPublish) {
          // Transaction to update Lesson AND check Program status
          await prisma.$transaction(async (tx) => {
            // A. Publish the Lesson
            await tx.lesson.update({
              where: { id: lesson.id },
              data: {
                status: 'PUBLISHED',
                publishedAt: now
              }
            })

            // B. Check the Program. If it's DRAFT, publish it too.
            // (Requirement: "Program automatically becomes published when it has ≥ 1 published lesson")
            const program = await tx.program.findUnique({ where: { id: lesson.termId } }) // Wait, lesson -> term -> program. We need to fetch term first.
            
            // Fetch Term to get Program ID
            const term = await tx.term.findUnique({ where: { id: lesson.termId } })
            if (term) {
              const prog = await tx.program.findUnique({ where: { id: term.programId } })
              
              if (prog && prog.status === 'DRAFT') {
                await tx.program.update({
                  where: { id: prog.id },
                  data: {
                    status: 'PUBLISHED',
                    publishedAt: now
                  }
                })
                console.log(`   -> Also published Program: ${prog.title}`)
              }
            }
          })
          console.log(`   -> Published Lesson: ${lesson.title}`)
        }
      } 
    } catch (error) {
      console.error('Worker Error:', error)
    }
  }, 60000) // Run every 60,000 ms (1 minute)
}