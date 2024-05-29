import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserAuth } from './user-auth.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToOne(() => UserAuth, (userAuth) => userAuth.user, {
    cascade: true,
  })
  userAuth: UserAuth;

  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    cascade: true,
  })
  userRoles: UserRole[];
}
