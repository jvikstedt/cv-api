import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, Unique, OneToMany } from 'typeorm';
import { ProjectMembership } from '../project_membership/project-membership.entity';

@Entity()
@Unique(['name'])
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ProjectMembership, projectMembership => projectMembership.project)
  projectMemberships: ProjectMembership[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<Project>) {
    super();
    Object.assign(this, init);
  }
}
