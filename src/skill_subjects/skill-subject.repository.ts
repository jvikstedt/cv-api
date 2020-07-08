import { SkillSubject } from './skill-subject.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateSkillSubjectDto } from './dto/create-skill-subject.dto';

@EntityRepository(SkillSubject)
export class SkillSubjectRepository extends Repository<SkillSubject> {
  async createSkillSubject(createSkillSubjectDto: CreateSkillSubjectDto): Promise<SkillSubject> {
    const { name, skillGroupId } = createSkillSubjectDto;

    const skillSubject = this.create({ name, skillGroupId });
    return skillSubject.save();
  }
}
