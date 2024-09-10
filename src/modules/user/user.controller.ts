import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  async getAll(): Promise<User[]> {
    return this.userService.users({});
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string; password: string },
  ): Promise<User> {
    return this.userService.createUser(userData);
  }
}