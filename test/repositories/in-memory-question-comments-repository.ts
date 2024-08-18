import { PAGE } from '@/core/constants/page'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  private items: QuestionComment[]

  constructor() {
    this.items = []
  }

  public async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter(
        (findQuestionComment) =>
          findQuestionComment.questionId.toString() === questionId,
      )
      .slice(
        (page - 1) * PAGE.DEFAULT_AMOUNT_OF_ITEMS,
        page * PAGE.DEFAULT_AMOUNT_OF_ITEMS,
      )

    return questionComments
  }

  public async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find(
      (findQuestionComment) => findQuestionComment.id.toString() === id,
    )

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  public async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.items.findIndex((findQuestionComment) => {
      return findQuestionComment.id.toString() === questionComment.id.toString()
    })

    this.items.splice(questionCommentIndex, 1)
  }

  public async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }
}
