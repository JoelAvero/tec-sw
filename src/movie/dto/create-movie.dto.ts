import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  episodeId: number;

  @IsString()
  @IsNotEmpty()
  openingCrawl: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsString()
  @IsNotEmpty()
  producer: string;

  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
