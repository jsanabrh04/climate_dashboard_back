import { Server } from 'socket.io';
import { Weather } from './entiities/weather.entity';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WeatherGateway {
  @WebSocketServer()
  server: Server;

  sendNewWeather(weather: Weather) {
    this.server.emit('new-weather', weather);
  }
}
