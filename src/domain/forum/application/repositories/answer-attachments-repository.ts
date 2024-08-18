import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export type AnswerAttachmentsRepository = {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
