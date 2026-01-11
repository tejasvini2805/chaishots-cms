import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function appRoutes(server: FastifyInstance) {

  // ==========================================
  // 1. PUBLIC CATALOG API (Consumer Facing)
  // ==========================================

  server.get('/catalog/programs', async (request, reply) => {
    const programs = await prisma.program.findMany({
      where: {
        status: 'PUBLISHED',
        terms: { some: { lessons: { some: { status: 'PUBLISHED' } } } }
      },
      include: { assets: true, topics: true },
      orderBy: { publishedAt: 'desc' }
    })
    return { data: programs }
  })

  server.get('/catalog/programs/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        assets: true,
        topics: true,
        terms: {
          include: {
            lessons: {
              where: { status: 'PUBLISHED' },
              orderBy: { lessonNumber: 'asc' }
            }
          },
          orderBy: { termNumber: 'asc' }
        }
      }
    })
    return { data: program }
  })

  // ==========================================
  // 2. CMS INTERNAL API (Admin/Editor)
  // ==========================================

  // Login (Mock)
  server.post('/api/login', async (request, reply) => {
    const { email } = request.body as any
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return reply.code(401).send({ error: 'Invalid user' })
    return { token: 'mock-token', user: { email: user.email, role: user.role } }
  })

  // Get All Programs (CMS)
  server.get('/api/programs', async () => {
    return await prisma.program.findMany({
      include: { assets: true },
      orderBy: { updatedAt: 'desc' }
    })
  })

  // Get Program Details (CMS)
  server.get('/api/programs/:id', async (request) => {
    const { id } = request.params as { id: string }
    return await prisma.program.findUnique({
      where: { id },
      include: { 
        assets: true, 
        topics: true,
        terms: {
          include: { lessons: true },
          orderBy: { termNumber: 'asc' }
        }
      }
    })
  })

  // "Backstage Pass" - Get ANY Lesson by ID (Drafts included)
  server.get('/api/lessons/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const lesson = await prisma.lesson.findUnique({ where: { id } })
    
    if (!lesson) return reply.code(404).send({ error: 'Lesson not found' })
    return { data: lesson }
  })

  // UPDATE LESSON (The Scheduler)
  server.put('/api/lessons/:id', async (request) => {
    const { id } = request.params as { id: string }
    const data = request.body as any
    
    console.log(`Updating lesson ${id} to status: ${data.status}`); // Debug log

    return await prisma.lesson.update({
      where: { id },
      data: {
        title: data.title,
        status: data.status,
        // Safe date conversion
        publishAt: data.publishAt ? new Date(data.publishAt) : null,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null
      }
    })
  })
}