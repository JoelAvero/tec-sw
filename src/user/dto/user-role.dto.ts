import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoles } from '../entities/user-role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserRoleDto {
  @ApiProperty({
    description: 'User role',
    enum: UserRoles,
  })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  role: UserRoles;
}
