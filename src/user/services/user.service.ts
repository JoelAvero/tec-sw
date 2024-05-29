import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole, UserRoles } from '../entities/user-role.entity';
import { User } from '../entities/user.entity';
import { UserAuth } from '../entities/user-auth.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}
  async create(createUserDto: CreateUserDto) {
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

        // Crear User
        const userAuth = this.userAuthRepository.create({
          password: createUserDto.password,
          user: savedUserDetails,
        });
        await queryRunner.manager.save(user);

        // Crear UserRole
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async remove(id: string) {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar las entidades relacionadas
      // const userDetails = await queryRunner.manager.findOne(UserDetails, id);
      // if (!userDetails) {
      //   throw new NotFoundException('User not found');
      // }

      // const userDetails = await queryRunner.manager.findOne(UserDetails, {
      //   where: { id: userDetails.id },
      // });
      // const userRole = await queryRunner.manager.findOne(UserRole, {
      //   where: { userDetailsId: userDetails.id },
      // });

      // // Eliminar las entidades
      // await queryRunner.manager.remove(userRole);
      // await queryRunner.manager.remove(userDetails);
      // await queryRunner.manager.remove(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
