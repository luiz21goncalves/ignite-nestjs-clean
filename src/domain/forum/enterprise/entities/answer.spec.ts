import { faker } from '@faker-js/faker'
import { makeAnswer } from '@test/factories/make-answer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Answer } from './answer'

describe('Answer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a answer', () => {
    const authorId = new UniqueEntityID()
    const content = faker.lorem.text()
    const questionId = new UniqueEntityID()
    const createdAt = faker.date.recent()
    const excerpt = content.substring(0, 120).trimEnd().concat('...')

    vi.setSystemTime(createdAt)

    const answer = Answer.create({
      authorId,
      content,
      questionId,
    })

    expect(answer.authorId).toStrictEqual(authorId)
    expect(answer.content).toStrictEqual(content)
    expect(answer.questionId).toStrictEqual(questionId)
    expect(answer.createdAt).toStrictEqual(createdAt)
    expect(answer.updatedAt).toBeUndefined()
    expect(answer.excerpt).toStrictEqual(excerpt)
    expect(answer.id).toBeInstanceOf(UniqueEntityID)
  })

  it('should be able to update a answer content', () => {
    const answer = makeAnswer({ content: 'content' })

    const updatedAt = faker.date.recent()
    vi.setSystemTime(updatedAt)

    answer.content = 'new content'

    expect(answer.content).toEqual('new content')
    expect(answer.updatedAt).toStrictEqual(updatedAt)
  })
})
