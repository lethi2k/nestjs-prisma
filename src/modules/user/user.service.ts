import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PageOptionsDto } from '@src/common/dto/page-options.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { IFile } from '@src/interfaces';
import { ValidatorService } from '@src/shared/services/validator.service';
import { AwsS3Service } from '@src/shared/services/aws-s3.service';
import { FileNotImageException, UserNotFoundException } from '@src/exceptions';
import { PageDto } from '@src/common/dto/page.dto';
import { PageMetaDto } from '@src/common/dto/page-meta.dto';
import { Order } from '@src/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validatorService: ValidatorService,
    private readonly awsS3Service: AwsS3Service,
  ) { }

  /**
   * Find single user
   */
  async findOne(findData: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email: options.email },
        ],
      },
      include: { settings: true },
    });
  }

  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: IFile,
  ): Promise<User> {
    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    let avatarUrl: string | null = null;

    if (file) {
      avatarUrl = await this.awsS3Service.uploadImage(file);
    }

    const user = await this.prisma.user.create({
      data: {
        ...userRegisterDto,
        avatar: avatarUrl || undefined,
        settings: {
          create: {
            isEmailVerified: false,
            isPhoneVerified: false,
          },
        },
      },
      include: { settings: true },
    });

    return user;
  }

  async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    const { take, skip } = pageOptionsDto;

    // Fetch users and total count
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: skip || undefined,
        take: take || undefined,
      }),
      this.prisma.user.count(),
    ]);

    // Create PageMetaDto
    const meta = new PageMetaDto({
      pageOptionsDto: {
        page: Math.floor((skip || 0) / (take || 1)) + 1,
        take: take || 10,
        skip: 0,
        order: Order.ASC
      },
      itemCount: total,
    });

    // Return PageDto instance
    return new PageDto<User>(data, meta);
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async createSettings(
    userId: number,
    createSettingsDto: CreateSettingsDto,
  ): Promise<void> {
    await this.prisma.userSettings.create({
      data: {
        userId,
        ...createSettingsDto,
      },
    });
  }
}
