import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ description: 'title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'episode Id' })
  @IsNumber()
  @IsNotEmpty()
  episodeId: number;

  @ApiProperty({ description: 'opening crawl' })
  @IsString()
  @IsNotEmpty()
  openingCrawl: string;

  @ApiProperty({ description: 'director' })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty({ description: 'producer' })
  @IsString()
  @IsNotEmpty()
  producer: string;

  @ApiProperty({ description: 'release date' })
  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
