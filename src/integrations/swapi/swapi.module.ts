import { Module } from '@nestjs/common';
import { SwapiService } from './services/swapi.service';
import { HttpModule } from '@nestjs/axios';
import { SwapiController } from './controllers/swapi.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Movie } from 'src/movie/entities/movie.entity';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [HttpModule, MovieModule],
  providers: [SwapiService],
  controllers: [SwapiController],
})
export class SwapiModule {}
