import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { SkillSubject } from '../skill_subjects/skill-subject.entity';

@Entity()
@Unique(['name'])
export class SkillGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SkillSubject, skillSubject => skillSubject.skillGroup)
  skillSubjects: SkillSubject[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<SkillGroup>) {
    super();
    Object.assign(this, init);
  }
}
