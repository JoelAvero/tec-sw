import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoles } from '../entities/user-role.entity';

export class UserRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRoles)
  role: UserRoles;
}
