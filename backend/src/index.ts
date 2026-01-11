import Fastify from 'fastify'
import cors from '@fastify/cors'
import { runWorker } from './worker'
import { PrismaClient } from '@prisma/client'
import { appRoutes } from './routes'

const prisma = new PrismaClient()
const server = Fastify({ logger: true })

// FIX: Explicitly allow PUT and other methods
server.register(cors, { 
  origin: true, // Allow any origin (like your frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // <--- Explicitly allow PUT
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})

server.register(appRoutes)

server.get('/health', async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1` 
    return { status: 'OK', database: 'connected' }
  } catch (err) {
    reply.code(500)
    return { status: 'ERROR', database: 'disconnected' }
  }
})

const start = async () => {
  try {
    runWorker()
    // Listen on 0.0.0.0 to accept connections from all network cards
    await server.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Server running at http://localhost:3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()