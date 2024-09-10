import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { ContextProvider } from '../providers';
import { UserDto } from '@src/modules/user/dtos/user.dto';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    // @ToDO
    // const user = request.user as UserDto;
    // ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
