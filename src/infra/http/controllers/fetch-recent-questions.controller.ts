import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { FetchResentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParaSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

@ApiBearerAuth()
@ApiTags('Questions')
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestions: FetchResentQuestionsUseCase,
  ) {}

  @Get()
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParaSchema))
    page: number,
  ) {
    const questions = await this.fetchRecentQuestions.execute({ page })

    return { questions }
  }
}
