import { BaseEntity } from 'src/common/base/base.entity';
import { Entity } from 'typeorm';

@Entity()
export class Movie extends BaseEntity {
  title: string;
  episodeId: number;
  openingCrawl: string;
  director: string;
  producer: string;
  releaseDate: string;
  url: string;
}
