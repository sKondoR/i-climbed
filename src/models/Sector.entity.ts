import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';

@Entity('sector')
export class Sector {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  uniqId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  numroutes!: number;

  @Column({ nullable: true })
  link!: string;

  @Column()
  @Index()
  placeId!: string;

  @ManyToOne('Place', (place: any) => place.children)
  place!: any;
}

// name: "Минусинский"
// numroutes: "<b>11</b> маршрутов"
// suns: "Тень"
// web_guide_link: "/ru/guides/минусинск/кампашка/минусинский/"

