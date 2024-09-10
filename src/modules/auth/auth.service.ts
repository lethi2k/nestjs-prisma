import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { RoleType, User } from '@prisma/client';
import { ApiConfigService } from '@src/shared/services/api-config.service';
import { TokenType } from '@src/constants';
import { UserNotFoundException } from '@src/exceptions';
import { validateHash } from '@src/common/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private prisma: PrismaService, // Inject PrismaService instead of UserService
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: number; // Assuming User ID is of type number in Prisma
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<User> {
    // Use Prisma to find the user
    const user = await this.prisma.user.findUnique({
      where: {
        email: userLoginDto.email,
      },
    });

    // Check if user exists and validate password
    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
