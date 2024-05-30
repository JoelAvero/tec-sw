import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole, UserRoles } from '../entities/user-role.entity';
import { User } from '../entities/user.entity';
import { UserAuth } from '../entities/user-auth.entity';
import { UserRoleDto } from '../dto/user-role.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    {
      const queryRunner =
        this.userRepository.manager.connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const user = this.userRepository.create({
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
        });
        const savedUserDetails = await queryRunner.manager.save(user);

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const userAuth = this.userAuthRepository.create({
          password: hashedPassword,
          user: savedUserDetails,
        });
        await queryRunner.manager.save(userAuth);

        const userRole = this.userRoleRepository.create({
          user: savedUserDetails,
          role: UserRoles.REGULAR_USER,
        });
        await queryRunner.manager.save(userRole);

        await queryRunner.commitTransaction();

        return;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }

  async addRole(id: string, roleToAdd: UserRoleDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRoleRepository.save({
      user,
      role: roleToAdd.role,
    });
  }

  async removeRole(id: string, roleToRemove: UserRoleDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRoleRepository.remove({
      user,
      role: roleToRemove.role,
    });
  }

  async findOneWithRoles(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id, {
      relations: ['userRoles'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserAuth(user: User): Promise<UserAuth> {
    return await this.userAuthRepository.findOne({ where: { user } });
  }
}
