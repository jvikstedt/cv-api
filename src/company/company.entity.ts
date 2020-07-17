import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, Unique, OneToMany } from 'typeorm';
import { WorkExperience } from '../work_experience/work-experience.entity';
import { Project } from '../project/project.entity';

@Entity()
@Unique(['name'])
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => WorkExperience, workExperience => workExperience.company)
  workExperiences: WorkExperience[];

  @OneToMany(() => Project, project => project.company)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<Company>) {
    super();
    Object.assign(this, init);
  }
}
