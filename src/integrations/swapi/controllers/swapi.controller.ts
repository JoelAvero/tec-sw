import { Controller, Get } from '@nestjs/common';
import { SwapiService } from '../services/swapi.service';

@Controller('swapi')
export class SwapiController {
  constructor(private swapiService: SwapiService) {}

  // @Get()
  // getFilms() {
  //   return this.swapiService.syncFilms();
  // }
}
