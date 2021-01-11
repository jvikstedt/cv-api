import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Education } from '../educations/education.entity';

@Entity()
@Unique(['name'])
export class School extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Education, (education) => education.school)
  educations: Education[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public constructor(init?: Partial<School>) {
    super();
    Object.assign(this, init);
  }
}
