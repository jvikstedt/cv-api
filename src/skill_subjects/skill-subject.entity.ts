import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Skill } from '../skills/skill.entity';
import { SkillGroup } from '../skill_groups/skill-group.entity';

@Entity()
@Unique(['name', 'skillGroup'])
export class SkillSubject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Skill, (skill) => skill.skillSubject)
  skills: Skill[];

  @ManyToOne(() => SkillGroup, (skillGroup) => skillGroup.skillSubjects, {
    nullable: false,
  })
  skillGroup: SkillGroup;

  @Column()
  skillGroupId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public constructor(init?: Partial<SkillSubject>) {
    super();
    Object.assign(this, init);
  }
}
