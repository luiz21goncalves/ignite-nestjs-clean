import { faker } from '@faker-js/faker'
import { makeAnswerComment } from '@test/factories/make-answer-comment'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswerComment } from './answer-comment'

describe('Answer Comment', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a answer comment', () => {
    const authorId = new UniqueEntityID()
    const content = faker.lorem.text()
    const answerId = new UniqueEntityID()
    const createdAt = faker.date.recent()

    vi.setSystemTime(createdAt)

    const answerComment = AnswerComment.create({
      answerId,
      authorId,
      content,
    })

    expect(answerComment.id).toBeInstanceOf(UniqueEntityID)
    expect(answerComment.answerId).toStrictEqual(answerId)
    expect(answerComment.authorId).toStrictEqual(authorId)
    expect(answerComment.createdAt).toStrictEqual(createdAt)
    expect(answerComment.updatedAt).toBeUndefined()
    expect(answerComment.content).toStrictEqual(content)
  })

  it('should be able to update a answer comment content', () => {
    const answerComment = makeAnswerComment({ content: 'content' })

    const updatedAt = faker.date.recent()
    vi.setSystemTime(updatedAt)

    answerComment.content = 'new content'

    expect(answerComment.content).toEqual('new content')
    expect(answerComment.updatedAt).toStrictEqual(updatedAt)
  })
})
