import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, OneToMany, Unique, ManyToOne } from 'typeorm';
import { Skill } from '../skills/skill.entity';
import { SkillGroup } from '../skill_groups/skill-group.entity';

@Entity()
@Unique(['name'])
export class SkillSubject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Skill, skill => skill.skillSubject)
  skills: Skill[];

  @ManyToOne(() => SkillGroup, skillGroup => skillGroup.skillSubjects, {
    nullable: false,
  })
  skillGroup: SkillGroup;

  @Column()
  skillGroupId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<SkillSubject>) {
    super();
    Object.assign(this, init);
  }
}
