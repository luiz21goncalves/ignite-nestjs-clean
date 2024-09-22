import { faker } from '@faker-js/faker'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from '@test/repositories/in-memory-students-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterStudentUseCase } from './register-student'

let fakeHasher: FakeHasher
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toStrictEqual({
      student: inMemoryStudentsRepository.items.at(0),
    })
  })

  it('should hash student password upon registration', async () => {
    const password = faker.internet.password()

    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password,
    })

    const hashedPassword = await fakeHasher.hash(password)

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items.at(0)?.password).toEqual(
      hashedPassword,
    )
  })
})
