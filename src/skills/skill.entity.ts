import * as R from 'ramda';
import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Unique,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { CV } from '../cv/cv.entity';
import { SkillSubject } from '../skill_subjects/skill-subject.entity';
import { MembershipSkill } from '../membership_skill/membership-skill.entity';

@Entity()
@Unique('SKILL_UQ_RELATION', ['skillSubject', 'cv'])
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real', default: 0 })
  experienceInYears: number;

  @Column({ type: 'real', default: 0 })
  projectExperienceInYears: number;

  @Column({ type: 'real', default: 0 })
  totalExperienceInYears: number;

  @Column()
  interestLevel: number;

  @Column({ default: false })
  highlight: boolean;

  @ManyToOne(() => CV, (cv) => cv.skills, {
    nullable: false,
  })
  cv: CV;

  @Column()
  cvId: number;

  @ManyToOne(() => SkillSubject, (skillSubject) => skillSubject.skills, {
    nullable: false,
  })
  skillSubject: SkillSubject;

  @Column()
  skillSubjectId: number;

  @OneToMany(() => MembershipSkill, (membershipSkill) => membershipSkill.skill)
  membershipSkills!: MembershipSkill[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  sumExperiences(): void {
    this.totalExperienceInYears = R.sum([
      R.defaultTo(0, this.experienceInYears),
      R.defaultTo(0, this.projectExperienceInYears),
    ]);
  }

  public constructor(init?: Partial<Skill>) {
    super();
    Object.assign(this, init);
  }
}
