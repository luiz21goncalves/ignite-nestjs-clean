import { makeAnswerComment } from '@test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@test/repositories/in-memory-answer-comments-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryAwnserCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAwnserCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new FetchAnswerCommentsUseCase(inMemoryAwnserCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const answerId = new UniqueEntityID()

    await Promise.all([
      inMemoryAwnserCommentsRepository.create(makeAnswerComment({ answerId })),
      inMemoryAwnserCommentsRepository.create(makeAnswerComment({ answerId })),
      inMemoryAwnserCommentsRepository.create(makeAnswerComment({ answerId })),
      inMemoryAwnserCommentsRepository.create(makeAnswerComment({ answerId })),
    ])

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 1,
    })

    expect(result.value?.answerComment).toHaveLength(4)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answerId = new UniqueEntityID()
    const promises: Promise<unknown>[] = []

    for (let index = 1; index <= 25; index++) {
      promises.push(
        inMemoryAwnserCommentsRepository.create(
          makeAnswerComment({ answerId }),
        ),
      )
    }

    await Promise.all(promises)

    const result = await sut.execute({
      page: 2,
      answerId: answerId.toString(),
    })

    expect(result.value?.answerComment).toHaveLength(5)
  })
})
