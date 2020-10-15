import { WorkExperience } from './work-experience.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';

@EntityRepository(WorkExperience)
export class WorkExperienceRepository extends Repository<WorkExperience> {
  async createWorkExperience(
    cvId: number,
    createWorkExperienceDto: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    const workExperience = this.create({
      cvId: cvId,
      companyId: createWorkExperienceDto.companyId,
      description: createWorkExperienceDto.description,
      jobTitle: createWorkExperienceDto.jobTitle,
      startYear: createWorkExperienceDto.startYear,
      startMonth: createWorkExperienceDto.startMonth,
      endYear: createWorkExperienceDto.endYear,
      endMonth: createWorkExperienceDto.endMonth,
      highlight: createWorkExperienceDto.highlight,
    });
    return workExperience.save();
  }
}
