import { ClassField } from '@src/decorators';
import { TokenPayloadDto } from './token-payload.dto';
import { User } from '@prisma/client';

export class LoginPayloadDto {
  user: User;

  @ClassField(() => TokenPayloadDto)
  token: TokenPayloadDto;

  constructor(user: User, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
