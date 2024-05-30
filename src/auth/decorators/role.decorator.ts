import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/user/entities/user-role.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
