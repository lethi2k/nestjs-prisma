import { User as PrismaUser, RoleType } from '@prisma/client'; // Import User type from Prisma Client
import { AbstractDto } from '@src/common/dto/abstract.dto';
import {
  BooleanFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  PhoneFieldOptional,
  StringFieldOptional,
} from '@src/decorators';

// Define options for UserDto construction
export type UserDtoOptions = Partial<{ isActive: boolean }>;

// UserDto class extending AbstractDto
export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @StringFieldOptional({ nullable: true })
  username!: string;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  @StringFieldOptional()
  password?: string | null; // Optional field for password

  @StringFieldOptional()
  fullName?: string | null; // Optional field for fullName

  @StringFieldOptional()
  userId?: string | null; // Optional field for userId

  constructor(user: PrismaUser) {
    super({
      id: user.id.toString(),
      createdAt: undefined,
      updatedAt: undefined,
      toDto: function (options?: any): Promise<AbstractDto> {
        throw new Error('Function not implemented.');
      }
    });

    // Assign fields from the user entity
    this.firstName = user.firstName ?? null;
    this.lastName = user.lastName ?? null;
    this.role = user.role;
    this.email = user.email ?? null;
    this.avatar = user.avatar ?? null;
    this.phone = user.phone ?? null;
    this.password = user.password ?? null; // Handle password if needed
    this.fullName = user.fullName ?? null; // Handle fullName if needed
    this.userId = user.userId?.toString() ?? null; // Handle userId if needed
  }
}
