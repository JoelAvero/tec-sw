import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';
import { UserService } from 'src/user/services/user.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate({ id, email }: JwtPayload) {
    const user = await this.userService.findOneWithRoles(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id, email, roles: user.userRoles.map(({ role }) => role) };
  }
}
