import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from './jwt'

export function requireAuth(
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const payload = verifyJwt(token)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
