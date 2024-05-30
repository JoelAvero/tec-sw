import { UserRoles } from 'src/user/entities/user-role.entity';

export interface JwtPayload {
  id: string;
  email: string;
  roles?: UserRoles[];
}
