// src/weather/weather.controller.ts

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Weather } from './entiities/weather.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * Obtiene el historial del clima (últimos N registros)
   * @query limit: número de registros a retornar (default 24)
   */
  @Get('history')
  async getHistory(@Query('limit') limit = 24): Promise<Weather[]> {
    return this.weatherService.getHistory(Number(limit));
  }

  /**
   * Endpoint para obtener una vista previa de los datos directamente desde la API externa
   */
  @Get('preview')
  async getPreview(): Promise<Weather> {
    return this.weatherService.fetchWeatherPreview();
  }

  /**
   * Llama manualmente a la función de guardado (útil para pruebas)
   */
  @Get('update-now')
  async updateNow(): Promise<Weather> {
    return this.weatherService.fetchAndSaveWeather();
  }
}
