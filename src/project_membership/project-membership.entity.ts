import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { CV } from '../cv/cv.entity';
import { Project } from '../project/project.entity';
import { MembershipSkill } from '../membership_skill/membership-skill.entity';

@Entity()
export class ProjectMembership extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  role: string;

  @Column({ type: 'smallint' })
  startYear: number;

  @Column({ type: 'smallint' })
  startMonth: number;

  @Column({ type: 'smallint', nullable: true })
  endYear: number;

  @Column({ type: 'smallint', nullable: true })
  endMonth: number;

  @Column({ default: false })
  highlight: boolean;

  @ManyToOne(() => CV, (cv) => cv.projectMemberships, {
    nullable: false,
  })
  cv: CV;

  @Column()
  cvId: number;

  @ManyToOne(() => Project, (project) => project.projectMemberships, {
    nullable: false,
  })
  project: Project;

  @OneToMany(
    () => MembershipSkill,
    (membershipSkill) => membershipSkill.projectMembership,
  )
  membershipSkills!: MembershipSkill[];

  @Column()
  projectId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<ProjectMembership>) {
    super();
    Object.assign(this, init);
  }
}
