import { Request, Response } from 'express'
import { loginSchema, registerSchema } from './auth.schema'
import { registerUser, loginUser } from './auth.service'
import { ZodError } from 'zod'

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body)
    const result = await registerUser(data.email, data.password)

    res.status(201).json({
      token: result.token,
      id: result.user.id,
      email: result.user.email,
    })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body)
    const result = await loginUser(data.email, data.password)
    res.json(result)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues })
    }
    return res.status(401).json({ message: 'Invalid credentials' })
  }
}
