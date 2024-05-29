import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetails } from '../entities/user-details.entity';
import { UserRole, UserRoles } from '../entities/user-role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
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
        // Crear UserDetails
        const userDetails = this.userDetailsRepository.create({
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
        });
        const savedUserDetails = await queryRunner.manager.save(userDetails);

        // Crear User
        const user = this.userRepository.create({
          password: createUserDto.password,
          userDetails: savedUserDetails,
        });
        await queryRunner.manager.save(user);

        // Crear UserRole
        const userRole = this.userRoleRepository.create({
          userDetails: savedUserDetails,
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

  findAll(): Promise<UserDetails[]> {
    return this.userDetailsRepository.find();
  }

  findOne(id: string): Promise<UserDetails> {
    return this.userDetailsRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userDetails = await this.findOne(id);

    if (!userDetails) {
      throw new NotFoundException('User not found');
    }

    return this.userDetailsRepository.save({
      ...userDetails,
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
      const userDetails = await queryRunner.manager.findOne(UserDetails, id);
      if (!userDetails) {
        throw new NotFoundException('User not found');
      }

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userDetails.id },
      });
      const userRole = await queryRunner.manager.findOne(UserRole, {
        where: { userDetailsId: userDetails.id },
      });

      // Eliminar las entidades
      await queryRunner.manager.remove(userRole);
      await queryRunner.manager.remove(userDetails);
      await queryRunner.manager.remove(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
