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
  Completed = 'completed',
  Failed = 'failed',
}

@Entity()
export class MergeRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sourceId: number;

  @Column()
  targetId: number;

  @Column()
  sourceName: string;

  @Column()
  targetName: string;

  @Column()
  entity: string;

  @Column({ default: '' })
  msg: string;

  @Column({
    type: 'enum',
    enum: State,
    default: State.Pending,
  })
  state: State;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.mergeRequests, {
    nullable: false,
  })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public constructor(init?: Partial<MergeRequest>) {
    super();
    Object.assign(this, init);
  }
}
