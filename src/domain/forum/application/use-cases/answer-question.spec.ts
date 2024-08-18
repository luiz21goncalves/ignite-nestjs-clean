import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      content: 'Nova resposta',
      instructorId: '1',
      questionId: '2',
      attachmentsIds: ['attachment-01', 'attachment-02'],
    })

    const answer = await inMemoryAnswersRepository.findById(
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      result.value?.answer.id.toString()!,
    )

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer).toStrictEqual(answer)
    expect(answer?.attachments.compareItems).toHaveLength(2)
    expect(answer?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-01'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-02'),
      }),
    ])
  })
})
