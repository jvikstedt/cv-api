import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Skill } from '../skills/skill.entity';
import { ProjectMembership } from '../project_membership/project-membership.entity';

@Entity()
export class MembershipSkill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', default: 0 })
  experienceInYears: number;

  @Column({ default: true })
  automaticCalculation: boolean;

  @ManyToOne(
    () => ProjectMembership,
    (projectMembership) => projectMembership.membershipSkills,
    { onDelete: 'CASCADE' },
  )
  projectMembership!: ProjectMembership;

  @Column()
  projectMembershipId!: number;

  @ManyToOne(() => Skill, (skill) => skill.membershipSkills, {
    onDelete: 'CASCADE',
  })
  skill!: Skill;

  @Column()
  skillId!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public constructor(init?: Partial<MembershipSkill>) {
    super();
    Object.assign(this, init);
  }
}
