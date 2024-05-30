import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from '../dto/create-movie.dto';
import { Movie } from '../entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
  ) {}
  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.findOne({
      where: { title: createMovieDto.title },
    });

    if (movie) {
      throw new BadRequestException('Movie already exists');
    }
    return this.movieRepository.save(createMovieDto);
  }

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  findOne(id: string): Promise<Movie> {
    return this.movieRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);

    if (!movie) {
      throw new NotFoundException("Movie doesn't exist");
    }
    return this.movieRepository.save({ ...movie, ...updateMovieDto });
  }

  async remove(id: string): Promise<void> {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException("Movie doesn't exist");
    }
    await this.movieRepository.remove(movie);
  }
}
