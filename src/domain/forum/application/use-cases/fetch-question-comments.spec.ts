import { makeQuestionComment } from '@test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@test/repositories/in-memory-question-comments-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let inMemoryQuestonCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestonCommentsRepository = new InMemoryQuestionCommentsRepository()

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestonCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const questionId = new UniqueEntityID()

    await Promise.all([
      inMemoryQuestonCommentsRepository.create(
        makeQuestionComment({ questionId }),
      ),
      inMemoryQuestonCommentsRepository.create(
        makeQuestionComment({ questionId }),
      ),
      inMemoryQuestonCommentsRepository.create(
        makeQuestionComment({ questionId }),
      ),
      inMemoryQuestonCommentsRepository.create(
        makeQuestionComment({ questionId }),
      ),
    ])

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    })

    expect(result.value?.questionComment).toHaveLength(4)
  })

  it('should be able to fetch paginated question comments', async () => {
    const questionId = new UniqueEntityID()
    const promises: Promise<unknown>[] = []

    for (let index = 1; index <= 25; index++) {
      promises.push(
        inMemoryQuestonCommentsRepository.create(
          makeQuestionComment({ questionId }),
        ),
      )
    }

    await Promise.all(promises)

    const result = await sut.execute({
      page: 2,
      questionId: questionId.toString(),
    })

    expect(result.value?.questionComment).toHaveLength(5)
  })
})
