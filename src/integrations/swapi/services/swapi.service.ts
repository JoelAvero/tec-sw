import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Movie } from 'src/movie/entities/movie.entity';
import { SwapiMovie } from '../types/swapi-movie.type';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService, ConfigType } from '@nestjs/config';
import config from 'src/config/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SwapiService {
  constructor(
    private httpService: HttpService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  private async getMovies(): Promise<SwapiMovie[]> {
    try {
      const { data } = await this.httpService.axiosRef.get<{
        results: SwapiMovie[];
      }>('https://swapi.dev/api/films/');

      return data.results;
    } catch (error) {
      throw new Error('API error');
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
        url: `${this.configService.baseUrl}/${id}`,
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
