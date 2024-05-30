import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from '../dto/create-movie.dto';
import { MovieService } from '../services/movie.service';
import { Movie } from '../entities/movie.entity';
import { Auth } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRoles } from 'src/user/entities/user-role.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@UseGuards(Auth, RolesGuard)
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({ summary: 'Create a new movie' })
  @Roles(UserRoles.ADMIN)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @ApiOperation({ summary: 'Get all movies' })
  @Get()
  findAll(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @ApiOperation({ summary: 'Get movie by id' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Movie> {
    return this.movieService.findOne(id);
  }

  @ApiOperation({ summary: 'Update movie by id' })
  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.movieService.update(id, updateMovieDto);
  }

  @ApiOperation({ summary: 'Delete movie by id' })
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.movieService.remove(id);
  }
}
