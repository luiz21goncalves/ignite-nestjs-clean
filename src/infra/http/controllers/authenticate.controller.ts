import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('Session')
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({ email, password })

    if (result.isLeft()) {
      throw new Error()
    }

    return { access_token: result.value.accessToken }
  }
}
