import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/validator/env.validator';
import config from './config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [config],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
