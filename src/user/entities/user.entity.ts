import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserDetails } from './user-details.entity ';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  password: string;

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  @JoinColumn()
  userDetails: UserDetails;
}
