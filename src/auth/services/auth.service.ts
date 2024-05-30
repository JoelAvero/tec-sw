import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dto/auth.dto';
import { UserService } from 'src/user/services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signIn(credentials: SignInDto) {}

  async validateEmailAndPassword(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userAuth = await this.userService.findUserAuth(user);

    const isPasswordValid = await bcrypt.compare(password, userAuth.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
