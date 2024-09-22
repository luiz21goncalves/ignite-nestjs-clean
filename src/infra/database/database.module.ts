import { Module } from '@nestjs/common'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'

import { PrismaService } from '../database/prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaNotificationsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    { useClass: PrismaQuestionsRepository, provide: QuestionsRepository },
    { useClass: PrismaStudentsRepository, provide: StudentsRepository },
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaNotificationsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    QuestionsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
