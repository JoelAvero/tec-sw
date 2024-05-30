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
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

const SWAPI_URL = 'https://swapi.dev/api/films/';

@Injectable()
export class SwapiService implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    this.syncFilms();
    this.addCronJob();
  }

  addCronJob() {
    const job = new CronJob(
      this.configService.syncMoviesFrequency,
      async () => {
        console.log('Syncing movies...');
        await this.syncFilms();
      },
    );

    this.schedulerRegistry.addCronJob('syncMovies', job);
    job.start();
  }

  private async getMovies(): Promise<SwapiMovie[]> {
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
