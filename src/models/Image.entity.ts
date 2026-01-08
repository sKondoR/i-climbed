import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ nullable: true })
  uniqId!: string;

  @Column({ type: "bytea" })
  imageData!: Buffer;

  @Column({ nullable: true })
  error!: string;

  @Column()
  @Index()
  routeId!: string;

  @ManyToOne('Route', (route: any) => route.children)
  route!: any;
}