import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ProjectMembership } from '../project_membership/project-membership.entity';
import { Company } from '../company/company.entity';

@Entity()
@Unique(['name'])
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => ProjectMembership,
    (projectMembership) => projectMembership.project,
  )
  projectMemberships: ProjectMembership[];

  @ManyToOne(() => Company, (company) => company.projects, {
    nullable: false,
  })
  company: Company;

  @Column()
  companyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<Project>) {
    super();
    Object.assign(this, init);
  }
}
