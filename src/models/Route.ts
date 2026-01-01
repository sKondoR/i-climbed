import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Sector } from '@/models';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  uniqId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  @Index()
  sectorId!: string;

  @ManyToOne('Sector', 'routes')
  sector!: Sector;
}

// images: [
//   {
//     Routes: [{
//       ascented_by_self: false
//       ascents: 2
//       author: "Шурупов Юрий"
//       bolts: "Точек: <B>6</B>"
//       creation_date: "2020 "
//       grade: "<B>6b+</B>"
//       info: "имеет общую станцию с трассой Чемодан"
//       length: "Длина: <B>11</B>м."
//       location: "Кампашка. Минусинский"
//       name: "Ты мечта моя"
//       top: "Станция: <B>Цепь</B>"
//       type: "<span style=\"font-size: 12px\"><I>Спорт</I></span>"
//       web_guide_link: "/ru/route/Минусинск/Кампашка/Минусинский/Ты мечта моя/"
//       web_guide_sector_link: "/ru/guides/Минусинск/Кампашка/Минусинский/Ты мечта моя/"
//     }],
//     hash: "d383d97acc7247db88e564d6eacf120febe1530d_1.jpg",
//     image: "https://d1bbd17bdaac68e4c34df4d7992c9394.r2.cloudflarestorage.com/allclimb-rr/storage/mdpi/d383d97acc7247db88e564d6eacf120febe1530d_1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1516ba7ebf2470fbbd0e4fac8eb4dce4%2F20260101%2F%2Fs3%2Faws4_request&X-Amz-Date=20260101T142201Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=01b44be4ed88ccba7892e287a126ba46044cdd5ef6ec09fc12927d4ff4556d8e",
//     imagesize: [853, 1137]
//   }
// ]