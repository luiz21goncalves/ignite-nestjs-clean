import { faker } from '@faker-js/faker'
import { makeQuestionComment } from '@test/factories/make-question-comment'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { QuestionComment } from './question-comment'

describe('Question Comment', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a question comment', () => {
    const authorId = new UniqueEntityID()
    const content = faker.lorem.text()
    const questionId = new UniqueEntityID()
    const createdAt = faker.date.recent()

    vi.setSystemTime(createdAt)

    const questionComment = QuestionComment.create({
      questionId,
      authorId,
      content,
    })

    expect(questionComment.id).toBeInstanceOf(UniqueEntityID)
    expect(questionComment.questionId).toStrictEqual(questionId)
    expect(questionComment.authorId).toStrictEqual(authorId)
    expect(questionComment.createdAt).toStrictEqual(createdAt)
    expect(questionComment.updatedAt).toBeUndefined()
    expect(questionComment.content).toStrictEqual(content)
  })

  it('should be able to update a question comment content', () => {
    const questionComment = makeQuestionComment({ content: 'content' })

    const updatedAt = faker.date.recent()
    vi.setSystemTime(updatedAt)

    questionComment.content = 'new content'

    expect(questionComment.content).toEqual('new content')
    expect(questionComment.updatedAt).toStrictEqual(updatedAt)
  })
})
