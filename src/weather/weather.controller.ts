import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Weather } from './entiities/weather.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('history')
  async getHistory(@Query('limit') limit = 24): Promise<Weather[]> {
    return this.weatherService.getHistory(Number(limit));
  }

  @Get('latest')
  async getPreview(): Promise<Weather> {
    return this.weatherService.fetchWeatherPreview();
  }

  @Get('update-now')
  async updateNow(): Promise<Weather> {
    return this.weatherService.fetchAndSaveWeather();
  }
}
