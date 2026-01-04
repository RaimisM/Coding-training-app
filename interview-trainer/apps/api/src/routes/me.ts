import { Router } from 'express'
import { requireAuth } from '../auth/auth.middleware'

const router = Router()

router.get('/me', requireAuth, (req, res) => {
  res.json({ userId: req.userId })
})

export default router
