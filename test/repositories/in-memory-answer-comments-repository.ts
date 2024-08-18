import { PAGE } from '@/core/constants/page'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  private items: AnswerComment[]

  constructor() {
    this.items = []
  }

  public async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter(
        (findAnswerComment) =>
          findAnswerComment.answerId.toString() === answerId,
      )
      .slice(
        (page - 1) * PAGE.DEFAULT_AMOUNT_OF_ITEMS,
        page * PAGE.DEFAULT_AMOUNT_OF_ITEMS,
      )

    return answerComments
  }

  public async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find(
      (findAnswerComment) => findAnswerComment.id.toString() === id,
    )

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  public async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
  }

  public async delete(answerComment: AnswerComment): Promise<void> {
    const answerIndex = this.items.findIndex((findAnswerComment) => {
      return findAnswerComment.id.toString() === answerComment.id.toString()
    })

    this.items.splice(answerIndex, 1)
  }
}
