import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum State {
  Pending = 'pending',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
  Approved = 'approved',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  runner: string;

  @Column('json')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  @Column({ default: false })
  skipApproval: boolean;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: State,
    default: State.Pending,
  })
  state: State;

  @Column({ default: '' })
  log: string;

  @ManyToOne(() => User, (user) => user.jobs, {
    nullable: false,
  })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public constructor(init?: Partial<Job>) {
    super();
    Object.assign(this, init);
  }
}
