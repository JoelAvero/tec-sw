import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { UserRoleDto } from '../dto/user-role.dto';
import { Auth } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRoles } from '../entities/user-role.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

// TODO: Handle queries by id, must be uuid

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(Auth, RolesGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneWithRoles(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.userService.remove(id);
  }

  // TODO: Only admin
  @Put(':id/role/add')
  updateUserRole(@Param('id') id: string, @Body() newRole: UserRoleDto) {
    return this.userService.addRole(id, newRole);
  }

  // TODO: Only admin
  @Put(':id/role/remove')
  removeUserRole(@Param('id') id: string, @Body() newRole: UserRoleDto) {
    return this.userService.removeRole(id, newRole);
  }
}
