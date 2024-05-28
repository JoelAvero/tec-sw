import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { signInDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signIn(@Body() credentials: signInDto) {
    return this.authService.signIn(credentials);
  }
}
