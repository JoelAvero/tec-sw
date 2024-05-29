import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Movie extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  title: string;

  @Column({ type: 'int' })
  episodeId: number;

  @Column({ type: 'text' })
  openingCrawl: string;

  @Column({ type: 'varchar' })
  director: string;

  @Column({ type: 'varchar' })
  producer: string;

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'varchar' })
  url: string;
}
