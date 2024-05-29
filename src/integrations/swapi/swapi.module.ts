import { Module } from '@nestjs/common';
import { SwapiService } from './services/swapi.service';
import { HttpModule } from '@nestjs/axios';
import { SwapiController } from './controllers/swapi.controller';

@Module({
  imports: [HttpModule],
  providers: [SwapiService],
  controllers: [SwapiController],
})
export class SwapiModule {}
