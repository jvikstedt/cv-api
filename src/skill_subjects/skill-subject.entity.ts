import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { Skill } from '../skills/skill.entity';

@Entity()
@Unique(['name'])
export class SkillSubject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Skill, skill => skill.skillSubject)
  skills: Skill[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public constructor(init?: Partial<SkillSubject>) {
    super();
    Object.assign(this, init);
  }
}
