import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Unique(['name'])
export class Template extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  exporter: string;

  @ManyToOne(() => User, (user) => user.templates)
  user: User;

  @Column()
  userId: number;

  @Column({ default: false })
  global: boolean;

  @Column('json')
  data: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public constructor(init?: Partial<Template>) {
    super();
    Object.assign(this, init);
  }
}
