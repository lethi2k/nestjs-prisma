import { Controller, Get, HttpCode, HttpStatus, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType, User } from '@prisma/client';


import { PageOptionsDto } from '@src/common/dto/page-options.dto';
import { PageDto } from '@src/common/dto/page.dto';
import { ApiPageResponse, Auth, AuthUser, UUIDParam } from '@src/decorators';
import { UseLanguageInterceptor } from '@src/interceptors/language-interceptor.service';
import { TranslationService } from '@src/shared/services/translation.service';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly translationService: TranslationService,
  ) {}

  @Get('admin')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(@AuthUser() user: User) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin',
    );

    return {
      text: `${translation} ${user.firstName}`,
    };
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiPageResponse({
    description: 'Get users list',
    type: PageDto<User>,
  })
  async getUsers(
    @Query(new ValidationPipe({ transform: true })) pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
  })
  getUser(@UUIDParam('id') userId: number): Promise<User> {
    return this.userService.getUser(userId);
  }
}
