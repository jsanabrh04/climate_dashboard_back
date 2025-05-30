import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Weather } from './entiities/weather.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Weather]),
    AxiosHttpModule,
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
