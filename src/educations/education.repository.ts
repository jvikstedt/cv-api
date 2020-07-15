import { Education } from './education.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateEducationDto } from './dto/create-education.dto';

@EntityRepository(Education)
export class EducationRepository extends Repository<Education> {
  async createEducation(cvId: number, createEducationDto: CreateEducationDto): Promise<Education> {
    const education = this.create({
      cvId: cvId,
      schoolId: createEducationDto.schoolId,
      degree: createEducationDto.degree,
      fieldOfStudy: createEducationDto.fieldOfStudy,
      description: createEducationDto.description,
      startYear: createEducationDto.startYear,
      endYear: createEducationDto.endYear
    });
    return education.save();
  }
}
