import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => User, user => user.templates)
  user: User;

  @Column()
  userId: number;

  @Column('json')
  data: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<Template>) {
    super();
    Object.assign(this, init);
  }
}
