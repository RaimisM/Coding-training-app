import bcrypt from 'bcryptjs'
import { prisma } from '../db'
import { signJwt } from './jwt'

export async function registerUser(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

  const token = signJwt({ userId: user.id })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  const token = signJwt({ userId: user.id })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  }
}
