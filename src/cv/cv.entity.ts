import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Skill } from '../skills/skill.entity';
import { Education } from '../educations/education.entity';
import { WorkExperience } from '../work_experience/work-experience.entity';
import { ProjectMembership } from '../project_membership/project-membership.entity';

@Entity()
export class CV extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToOne(() => User, (user) => user.cv)
  @JoinColumn()
  user: User;

  @OneToMany(() => Skill, (skill) => skill.cv)
  skills: Skill[];

  @OneToMany(() => Education, (education) => education.cv)
  educations: Education[];

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.cv)
  workExperiences: WorkExperience[];

  @OneToMany(
    () => ProjectMembership,
    (projectMembership) => projectMembership.cv,
  )
  projectMemberships: ProjectMembership[];

  @Column()
  userId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public constructor(init?: Partial<CV>) {
    super();
    Object.assign(this, init);
  }
}
