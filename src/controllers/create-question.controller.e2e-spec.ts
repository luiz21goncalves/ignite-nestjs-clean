import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { beforeAll, describe, expect, test } from 'vitest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('Create question (e2e)', () => {
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

  test('[post] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const title = faker.lorem.sentence()
    const content = faker.lorem.text()

    const response = await request(app.getHttpServer())
      .post('/questions')
      .auth(accessToken, { type: 'bearer' })
      .send({
        title,
        content,
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findMany({
      where: { authorId: user.id },
    })

    expect(questionOnDatabase).toStrictEqual([
      {
        id: expect.any(String),
        slug: expect.any(String),
        title,
        content,
        authorId: user.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ])
  })
})
