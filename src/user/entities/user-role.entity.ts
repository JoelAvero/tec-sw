import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

export enum UserRoles {
  ADMIN = 'admin',
  REGULAR_USER = 'regular_user',
}

@Entity()
@Unique(['userDetails', 'role'])
export class UserRole {
  @ManyToOne(() => User, (user) => user.userRoles, {
    primary: true,
  })
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.REGULAR_USER,
    primary: true,
  })
  role: string;
}
