import { PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { CV } from '../cv/cv.entity';
import { School } from '../schools/school.entity';

@Entity()
@Unique('EDUCATION_UQ_RELATION', ['school', 'cv'])
export class Education extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  degree: string;

  @Column()
  fieldOfStudy: string;

  @Column()
  description: string;

  @Column({ type: 'smallint' })
  startYear: number;

  @Column({ type: 'smallint', nullable: true })
  endYear: number;

  @ManyToOne(() => CV, cv => cv.educations, {
    nullable: false,
  })
  cv: CV;

  @Column()
  cvId: number;

  @ManyToOne(() => School, school => school.educations, {
    nullable: false,
  })
  school: School;

  @Column()
  schoolId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<Education>) {
    super();
    Object.assign(this, init);
  }
}