import { faker } from '@faker-js/faker'
import { makeQuestion } from '@test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const newQuestion = makeQuestion()
    const content = faker.lorem.text()

    await inMemoryQuestionsRepository.create(newQuestion)
    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
      content,
    })

    const { questionComment } = result.value as {
      questionComment: QuestionComment
    }

    expect(result.isRight()).toBe(true)
    expect(questionComment.authorId.toString()).toStrictEqual(
      newQuestion.authorId.toString(),
    )
    expect(questionComment.questionId.toString()).toStrictEqual(
      newQuestion.id.toString(),
    )
    expect(questionComment.content).toStrictEqual(content)
  })

  it('should not be able to comment on a non-existing question', async () => {
    const content = faker.lorem.text()

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: 'non-existing-question',
      content,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
