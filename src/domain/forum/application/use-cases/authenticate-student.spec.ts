import { faker } from '@faker-js/faker'
import { FakerEncrypter } from '@test/cryptography/fake-encrypter'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeStudent } from '@test/factories/make-student'
import { InMemoryStudentsRepository } from '@test/repositories/in-memory-students-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { AuthenticateStudentUseCase } from './authenticate-student'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let fakeHasher: FakeHasher
let fakeEncrypter: FakerEncrypter
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakerEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    const student = makeStudent({
      email,
      password: await fakeHasher.hash(password),
    })
    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toStrictEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate a student with wrong email', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    const student = makeStudent({
      password: await fakeHasher.hash(password),
    })
    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toStrictEqual(new WrongCredentialsError())
  })

  it('should not be able to authenticate a student with wrong password', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    const student = makeStudent({
      email,
    })
    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toStrictEqual(new WrongCredentialsError())
  })
})
