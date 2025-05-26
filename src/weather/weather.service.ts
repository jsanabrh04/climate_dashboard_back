import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { Weather } from './entiities/weather.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly city: string;

  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepo: Repository<Weather>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    this.city = this.configService.get<string>('CITY') || 'Bogotá';
  }

  async fetchAndSaveWeather(): Promise<Weather> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}&units=metric`;

  const response = await lastValueFrom(this.httpService.get(url));
  const data = response.data;

  const weatherSnapshot = this.weatherRepo.create({
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    conditions: data.weather[0].description,
    capturedAt: new Date(data.dt * 1000),
  });

  return await this.weatherRepo.save(weatherSnapshot);
}

  async getHistory(limit = 24): Promise<Weather[]> {
    return this.weatherRepo.find({
      order: { capturedAt: 'DESC' },
      take: limit,
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Cron job started: Fetching and saving weather data...');
    try {
      await this.fetchAndSaveWeather();
      this.logger.log('Weather data updated successfully.');
    } catch (error) {
      this.logger.error('Error updating weather data in cron job', error);
    }
  }

  async fetchWeatherPreview(): Promise<Weather> {
    const latest = await this.weatherRepo.findOne({
      where: {},
      order: { capturedAt: 'DESC' },
    });
  
    if (!latest) {
      throw new Error('No weather data found');
    }
  
    return latest;
  }
}
