import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SignInDto } from '../dto/auth.dto';
import { LocalGuard } from '../guards/local.guard';
import { UserService } from 'src/user/services/user.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  async signIn(@Body() credentials: SignInDto) {
    const { email, id, userRoles } =
      await this.userService.findOneWithRolesAndAuthByEmail(credentials.email);
    const payload: JwtPayload = {
      email,
      id,
      roles: userRoles.map(({ role }) => role),
    };
    return this.jwtService.sign(payload);
  }
}
