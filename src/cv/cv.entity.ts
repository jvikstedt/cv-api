import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Skill } from '../skills/skill.entity';

@Entity()
export class CV extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToOne(() => User, user => user.cv)
  @JoinColumn()
  user: User;

  @OneToMany(() => Skill, skill => skill.cv)
  skills: Skill[];

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<CV>) {
    super();
    Object.assign(this, init);
  }
}
