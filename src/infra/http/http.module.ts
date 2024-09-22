import { Module } from '@nestjs/common'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchResentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'

import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { CryptographyModule } from './cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase, FetchResentQuestionsUseCase],
})
export class HttpModule {}
