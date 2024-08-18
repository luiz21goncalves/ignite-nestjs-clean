import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { beforeAll, describe, expect, test } from 'vitest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create account (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[post] /accounts', async () => {
    const name = faker.person.fullName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const response = await request(app.getHttpServer()).post('/accounts').send({
      name,
      email,
      password,
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({ where: { email } })

    expect(userOnDatabase).toStrictEqual({
      id: expect.any(String),
      name,
      email,
      password: expect.any(String),
    })
  })
})
