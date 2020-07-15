import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Skill } from '../skills/skill.entity';
import { Education } from '../educations/education.entity';

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

  @OneToMany(() => Education, education => education.cv)
  educations: Education[];

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
