import { PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { CV } from '../cv/cv.entity';
import { Company } from '../company/company.entity';

@Entity()
@Unique('WORK_EXPERIENCE_UQ_RELATION', ['company', 'cv'])
export class WorkExperience extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  jobTitle: string;

  @Column({ type: 'smallint' })
  startYear: number;

  @Column({ type: 'smallint' })
  startMonth: number;

  @Column({ type: 'smallint', nullable: true })
  endYear: number;

  @Column({ type: 'smallint', nullable: true })
  endMonth: number;

  @ManyToOne(() => CV, cv => cv.workExperiences, {
    nullable: false,
  })
  cv: CV;

  @Column()
  cvId: number;

  @ManyToOne(() => Company, company => company.workExperiences, {
    nullable: false,
  })
  company: Company;

  @Column()
  companyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<WorkExperience>) {
    super();
    Object.assign(this, init);
  }
}
