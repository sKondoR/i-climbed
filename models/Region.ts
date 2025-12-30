import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class Region {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  country!: string;

  @Column()
  season!: string;

  @Column()
  link!: string;

  @Column()
  updatedAt: Date = new Date();
}
