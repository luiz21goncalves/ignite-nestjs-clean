import { makeQuestion } from '@test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchResentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchResentQuestionsUseCase

describe('Fetch Resent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new FetchResentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await Promise.all([
      inMemoryQuestionsRepository.create(
        makeQuestion({
          createdAt: new Date(2023, 4, 15),
        }),
      ),
      inMemoryQuestionsRepository.create(
        makeQuestion({
          createdAt: new Date(2023, 4, 10),
        }),
      ),
      inMemoryQuestionsRepository.create(
        makeQuestion({
          createdAt: new Date(2023, 4, 5),
        }),
      ),
    ])

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toStrictEqual([
      expect.objectContaining({ createdAt: new Date(2023, 4, 15) }),
      expect.objectContaining({ createdAt: new Date(2023, 4, 10) }),
      expect.objectContaining({ createdAt: new Date(2023, 4, 5) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    const promises: Promise<unknown>[] = []

    for (let index = 1; index <= 25; index++) {
      promises.push(inMemoryQuestionsRepository.create(makeQuestion()))
    }

    await Promise.all(promises)

    const result = await sut.execute({ page: 2 })

    expect(result.value?.questions).toHaveLength(5)
  })
})
