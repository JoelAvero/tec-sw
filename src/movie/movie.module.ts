import { Module } from '@nestjs/common';
import { MovieService } from './services/movie.service';
import { MovieController } from './controllers/movie.controller';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
