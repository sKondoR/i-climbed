import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('json', { nullable: true })
  scrapStats!: {
    regions: number;
    regionsErrors: number;
    places: number;
    placesErrors: number;
    sectors: number;
    sectorsErrors: number;
    routes: number;
    routesErrors?: number;
    scrapDate: string;
    scrapDuration?: string;
};
}
