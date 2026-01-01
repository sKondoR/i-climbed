import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { Place, Route } from '@/models';

@Entity()
export class Sector {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  uniqId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  numroutes!: number;

  @Column()
  link!: string;

  @Column()
  @Index()
  placeId!: string;

  @ManyToOne('Place', 'children')
  place!: Place;

  @OneToMany('Route', 'sector')
  children!: Route[];
}

// name: "Минусинский"
// numroutes: "<b>11</b> маршрутов"
// suns: "Тень"
// web_guide_link: "/ru/guides/минусинск/кампашка/минусинский/"

