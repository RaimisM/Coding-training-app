import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { prisma } from '../src/db'

const app = createApp()

// Test data
const testUser = {
  email: 'testuser@example.com',
  password: 'password123',
}

describe('Auth API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send(testUser)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.email).toBe(testUser.email)
  })

  it('should not register the same user twice', async () => {
    const res = await request(app).post('/auth/register').send(testUser)

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('User already exists')
  })

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/auth/login').send(testUser)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe(testUser.email)
  })

  it('should fail login with wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: 'wrongpass',
    })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('should protect a route', async () => {
    const loginRes = await request(app).post('/auth/login').send(testUser)
    const token = loginRes.body.token

    const res = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('userId')
  })

  it('should reject access to protected route without token', async () => {
    const res = await request(app).get('/me')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })
})
