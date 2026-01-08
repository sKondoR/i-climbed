import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';

@Entity('route')
export class Route {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  uniqId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  author?: string;

  @Column({ nullable: true })
  bolts?: string;

  @Column({ nullable: true })
  type?: string; 

  @Column({ nullable: true })
  grade?: string;

  @Column({ nullable: true })
  length?: string;

  @Column({ nullable: true })
  top?: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  sectorLink?: string;

  @Column()
  @Index()
  sectorId!: string;

  @ManyToOne('Sector', (sector: any) => sector.children)
  sector!: any;
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



// spline: "e10450077f0234027f02380280023d028102430282024a028402520285025a028602620288026a02890273028a027b028b0283028b028b028c0292028b0298028b029e028b02a4028a02aa028902b0028802b6028702bc028602c2028502c7028302cd028202d2028002d7027f02dd027d02e2027b02e7027902eb027702f0027502f5027202f9027002fe026e0202036b02070369020b03660210036302150361021a035e021e035b0223035802280355022d03520232034f0237034b023c03480241034502460341024b033e0250033b02550338025b0334026003300265032d026b03290271032502770321027d031d0283031902880315028e03120292030f0297030d029a030b029e030902a0030802a1030702a2030602a3030602a3030602a3030602a2030602a2030602a1030602a1030602a0030702a003"
// type:"<span style=\"font-size: 12px\"><I>Боулдер</I></span>"