import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';

@Entity()
export class UserDetails extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToOne(() => User, (user) => user.userDetails)
  user: User;

  @OneToMany(() => UserRole, (userRole) => userRole.userDetails)
  userRoles: UserRole[];
}
