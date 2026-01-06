import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Route } from '@/models';

@Entity()
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

  @ManyToOne('Route', 'children')
  route!: Route;
}
