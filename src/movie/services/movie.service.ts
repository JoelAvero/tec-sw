import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from '../dto/create-movie.dto';
import { Movie } from '../entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { title: createMovieDto.title },
    });

    if (movie) {
      throw new BadRequestException('Movie already exists');
    }

    const id = uuidv4();

    const newMovie = {
      ...createMovieDto,
      id,
      url: `${this.configService.baseUrl}/movie/${id}`,
    };
    return this.movieRepository.save(newMovie);
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
