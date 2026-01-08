import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('region')
export class Region {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  uniqId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  season?: string;

  @Column({ nullable: true })
  link?: string;
}

    // Picture: null,
    // country: 'Германия',
    // hash: '1288827035',
    // info: null,
    // lat: 49.5458577142,
    // lng: 11.1205914617,
    // maplat: 49.406577694,
    // maplng: 11.5139223263,
    // name: 'Frankenjura',
    // season: 'Сезон: <b>мар - ноя</b>',
    // web_guide_link: '/ru/guides/frankenjura/',
    // zoom: 8.00796508789