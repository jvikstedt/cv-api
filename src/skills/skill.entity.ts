import { PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { CV } from '../cv/cv.entity';
import { SkillSubject } from '../skill_subjects/skill-subject.entity';

@Entity()
@Unique('SKILL_UQ_RELATION', ['skillSubject', 'cv'])
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  experienceInYears: number;

  @ManyToOne(() => CV, cv => cv.skills, {
    nullable: false,
  })
  cv: CV;

  @Column()
  cvId: number;

  @ManyToOne(() => SkillSubject, skillSubject => skillSubject.skills, {
    nullable: false,
  })
  skillSubject: SkillSubject;

  @Column()
  skillSubjectId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<Skill>) {
    super();
    Object.assign(this, init);
  }
}
