import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { UserDetails } from './user-details.entity ';

enum UserRoles {
  ADMIN = 'admin',
  REGULAR_USER = 'regular_user',
}

@Entity()
@Unique(['userDetails', 'role'])
export class UserRole {
  @ManyToOne(() => UserDetails, (user) => user.userRoles)
  @JoinColumn()
  userDetails: UserDetails;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.REGULAR_USER })
  role: string;
}
