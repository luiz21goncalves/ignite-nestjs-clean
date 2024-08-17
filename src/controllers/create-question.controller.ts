import { Controller, Post, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger'

import { CurrentUser } from '../auth/current-user-decorator'
import { UserPayload } from '../auth/jwt.strategy'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiBearerAuth()
@ApiTags('Questions')
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user)

    return 'ok'
  }
}
