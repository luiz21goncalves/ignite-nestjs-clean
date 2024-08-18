import { makeAnswer } from '@test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const questionId = new UniqueEntityID()

    await Promise.all([
      inMemoryAnswersRepository.create(makeAnswer({ questionId })),
      inMemoryAnswersRepository.create(makeAnswer({ questionId })),
      inMemoryAnswersRepository.create(makeAnswer({ questionId })),
      inMemoryAnswersRepository.create(makeAnswer({ questionId })),
    ])

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(4)
  })

  it('should be able to fetch paginated question answers', async () => {
    const questionId = new UniqueEntityID()
    const promises: Promise<unknown>[] = []

    for (let index = 1; index <= 25; index++) {
      promises.push(
        inMemoryAnswersRepository.create(makeAnswer({ questionId })),
      )
    }

    await Promise.all(promises)

    const result = await sut.execute({
      page: 2,
      questionId: questionId.toString(),
    })

    expect(result.value?.answers).toHaveLength(5)
  })
})
