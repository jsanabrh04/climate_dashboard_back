import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  temperature: number;

  @Column('float')
  feelsLike: number;

  @Column('int')
  humidity: number;

  @Column()
  conditions: string;

  @Column()
  capturedAt: Date;
}
