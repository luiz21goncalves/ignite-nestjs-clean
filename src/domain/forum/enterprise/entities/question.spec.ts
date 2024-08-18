import { faker } from '@faker-js/faker'
import { makeQuestion } from '@test/factories/make-question'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Question } from './question'
import { Slug } from './value-objects/slug'

describe('Question', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a question', () => {
    const authorId = new UniqueEntityID()
    const content = faker.lorem.text()
    const title = faker.lorem.sentence()
    const createdAt = faker.date.recent()
    const excerpt = content.substring(0, 120).trimEnd().concat('...')

    vi.setSystemTime(createdAt)

    const question = Question.create({
      authorId,
      content,
      title,
    })

    expect(question.id).toBeDefined()
    expect(question.title).toEqual(title)
    expect(question.content).toEqual(content)
    expect(question.slug).toEqual(Slug.createFromText(title))
    expect(question.authorId).toEqual(authorId)
    expect(question.excerpt).toEqual(excerpt)
    expect(question.updatedAt).toBeUndefined()
    expect(question.bestAnswerId).toBeUndefined()
    expect(question.createdAt).toEqual(createdAt)
    expect(question.isNew).toEqual(true)
  })

  it('should be able to update content', () => {
    const question = makeQuestion({ content: 'content' })

    const updatedAt = faker.date.recent()
    vi.setSystemTime(updatedAt)

    question.content = 'new content'

    expect(question.content).toEqual('new content')
    expect(question.updatedAt).toEqual(updatedAt)
  })

  it('should be able to update content', () => {
    const question = makeQuestion({ title: 'title' })

    const updatedAt = faker.date.recent()
    vi.setSystemTime(updatedAt)

    question.title = 'new title'

    expect(question.title).toEqual('new title')
    expect(question.updatedAt).toEqual(updatedAt)
  })

  it('should be able to set best answer id', () => {
    const question = makeQuestion({ title: 'title' })

    const updatedAt = faker.date.recent()
    vi.setSystemTime(updatedAt)

    const bestAnswerId = new UniqueEntityID()

    question.bestAnswerId = bestAnswerId

    expect(question.bestAnswerId).toEqual(bestAnswerId)
    expect(question.updatedAt).toEqual(updatedAt)
  })
})
