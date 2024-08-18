import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'New Question',
      content: 'Question content',
      attachmentsIds: ['attachment-01', 'attachment-02'],
    })

    const question = await inMemoryQuestionsRepository.findById(
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      result.value?.question.id.toString()!,
    )

    expect(result.isRight()).toBe(true)
    expect(result.value?.question).toStrictEqual(question)
    expect(question?.attachments.compareItems).toHaveLength(2)
    expect(question?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-01'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-02'),
      }),
    ])
  })
})
