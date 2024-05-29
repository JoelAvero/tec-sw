import { Module } from '@nestjs/common';
import { SwapiService } from './services/swapi.service';
import { HttpModule } from '@nestjs/axios';
import { SwapiController } from './controllers/swapi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';

@Module({
  // TODO: import movie service instead repository directly
  imports: [HttpModule, TypeOrmModule.forFeature([Movie])],
  providers: [SwapiService],
  controllers: [SwapiController],
})
export class SwapiModule {}
