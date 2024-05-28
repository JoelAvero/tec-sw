import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/validator/env.validator';
import { AppController } from './app.controller';
import config from './config';
import { environments } from './environments';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.STAGE] || '.env',
      validate,
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    MovieModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
