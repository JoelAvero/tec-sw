import { Injectable } from '@nestjs/common';
import { signInDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  signIn(credentials: signInDto) {
    return 'This action adds a new auth';
  }
}
