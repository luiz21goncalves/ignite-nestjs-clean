import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { beforeAll, describe, expect, test } from 'vitest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Fetch recent questions (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[get] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      },
    })

    await prisma.question.createMany({
      data: [
        {
          authorId: user.id,
          title: faker.lorem.sentence(),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
        },
        {
          authorId: user.id,
          title: faker.lorem.sentence(),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
        },
        {
          authorId: user.id,
          title: faker.lorem.sentence(),
          content: faker.lorem.text(),
          slug: faker.lorem.slug(),
        },
      ],
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .auth(accessToken, { type: 'bearer' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({ questions: expect.any(Array) })
    expect(response.body.questions).toHaveLength(3)
  })
})
