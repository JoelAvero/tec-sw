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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// TODO: Handle queries by id, must be uuid

@ApiTags('User')
@UseGuards(Auth)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneWithRoles(id);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.userService.remove(id);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Add role to user' })
  @Put(':id/role/add')
  updateUserRole(@Param('id') id: string, @Body() newRole: UserRoleDto) {
    return this.userService.addRole(id, newRole);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Remove role from user' })
  @Put(':id/role/remove')
  removeUserRole(@Param('id') id: string, @Body() newRole: UserRoleDto) {
    return this.userService.removeRole(id, newRole);
  }
}
