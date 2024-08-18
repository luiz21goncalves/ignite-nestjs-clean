import { Either, right } from '@/core/either'

import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

type FetchResentQuestionsRequest = {
  page: number
}

type FetchResentQuestionsResponse = Either<null, { questions: Question[] }>

export class FetchResentQuestionsUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  public async execute({
    page,
  }: FetchResentQuestionsRequest): Promise<FetchResentQuestionsResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({ questions })
  }
}
