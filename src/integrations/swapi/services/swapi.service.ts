import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Movie } from 'src/movie/entities/movie.entity';
import { SwapiMovie } from '../types/swapi-movie.type';
import { v4 as uuidv4 } from 'uuid';
import { ConfigType } from '@nestjs/config';
import config from 'src/config/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import * as dotenv from 'dotenv';

const getCronInterval = () => {
  dotenv.config();
  return process.env.SYNC_FILMS_FREQUENCY || '* * * * 0';
};

const SWAPI_URL = 'https://swapi.dev/api/films/';

@Injectable()
export class SwapiService implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  onModuleInit() {
    this.syncFilms();
  }

  @Cron(getCronInterval())
  private async getMovies(): Promise<SwapiMovie[]> {
    console.log('asd');

    try {
      const { data } = await this.httpService.axiosRef.get<{
        results: SwapiMovie[];
      }>(SWAPI_URL);

      return data.results;
    } catch (error) {
      // TODO: send error to cloudwatch or something
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  private normalizeFilms(films: SwapiMovie[]): Partial<Movie>[] {
    return films.map((film) => {
      const id = uuidv4();
      return {
        id,
        title: film.title,
        episodeId: film.episode_id,
        openingCrawl: film.opening_crawl,
        director: film.director,
        producer: film.producer,
        releaseDate: new Date(film.release_date),
        url: `${this.configService.baseUrl}/movie/${id}`,
      };
    });
  }

  async syncFilms() {
    const films = await this.getMovies();
    const normalizedFilms = this.normalizeFilms(films);

    for (const film of normalizedFilms) {
      const exists = await this.movieRepository.findOne({
        where: { title: film.title },
      });
      if (!exists) {
        await this.movieRepository.save(film);
      }
    }

    return normalizedFilms;
  }
}
