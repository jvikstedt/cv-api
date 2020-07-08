import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillSubject } from './skill-subject.entity';
import { SkillSubjectRepository } from './skill-subject.repository';
import { CreateSkillSubjectDto } from './dto/create-skill-subject.dto';
import { UpdateSkillSubjectDto } from './dto/update-skill-subject.dto';
import { SearchSkillSubjectDto } from './dto/search-skill-subject.dto';

@Injectable()
export class SkillSubjectsService {
  constructor(
    @InjectRepository(SkillSubjectRepository)
    private readonly skillSubjectRepository: SkillSubjectRepository,
  ) {}

  async create(createSkillSubjectDto: CreateSkillSubjectDto): Promise<SkillSubject> {
    const skillSubjects = await this.skillSubjectRepository
      .createQueryBuilder()
      .where("LOWER(name) = LOWER(:name)", {
        name: createSkillSubjectDto.name
      }).getMany();

    if (skillSubjects.length > 0) {
      throw new UnprocessableEntityException();
    }

    const skillSubject = await this.skillSubjectRepository.createSkillSubject(createSkillSubjectDto);

    return skillSubject;
  }

  async update(id: number, updateSkillSubjectDto: UpdateSkillSubjectDto): Promise<SkillSubject> {
    const skillSubject = await this.findOne(id);

    skillSubject.name = updateSkillSubjectDto.name;

    return await this.skillSubjectRepository.save(skillSubject);
  }

  async findAll(): Promise<SkillSubject[]> {
    return this.skillSubjectRepository.find({ relations: ['skillGroup'] });
  }

  async findOne(id: number): Promise<SkillSubject> {
    const entity = await this.skillSubjectRepository.findOne(id, { relations: ['skillGroup'] });
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(id: number): Promise<void> {
    const result = await this.skillSubjectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async search(searchSkillSubjectDto: SearchSkillSubjectDto): Promise<SkillSubject[]> {
    return this.skillSubjectRepository
      .createQueryBuilder('skillSubject')
      .where("skillSubject.name ilike :name", { name: `%${searchSkillSubjectDto.name}%` })
      .leftJoinAndSelect("skillSubject.skillGroup", "skillGroup")
      .limit(searchSkillSubjectDto.limit)
      .getMany();
  }
}
