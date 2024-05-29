import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAuth {
  @Column({ type: 'varchar' })
  password: string;

  @OneToOne(() => User, (user) => user.userAuth)
  user: User;
}
