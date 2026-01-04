import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health'
import authRouter from './auth/auth.routes'
import meRouter from './routes/me'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use('/health', healthRouter)
  app.use('/auth', authRouter)
  app.use(meRouter)

  return app
}
