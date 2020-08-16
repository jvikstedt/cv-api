import * as R from 'ramda';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { PatchProjectDto } from './dto/patch-project.dto';
import { SearchProjectDto } from './dto/search-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const projects = await this.projectRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', {
        name: createProjectDto.name,
      })
      .getMany();

    if (projects.length > 0) {
      throw new UnprocessableEntityException(
        `Project '${createProjectDto.name}' already exists`,
      );
    }

    const project = await this.projectRepository.createProject(
      createProjectDto,
    );

    return project;
  }

  async patch(
    projectId: number,
    patchProjectDto: PatchProjectDto,
  ): Promise<Project> {
    const oldProject = await this.findOne(projectId);

    const newProject = R.merge(oldProject, patchProjectDto);

    return this.projectRepository.save(newProject);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['company'] });
  }

  async findOne(projectId: number): Promise<Project> {
    const entity = await this.projectRepository.findOne(projectId, {
      relations: ['company'],
    });
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async delete(projectId: number): Promise<void> {
    const result = await this.projectRepository.delete(projectId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async search(searchProjectDto: SearchProjectDto): Promise<Project[]> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.name ilike :name', { name: `%${searchProjectDto.name}%` })
      .leftJoinAndSelect('project.company', 'company')
      .limit(searchProjectDto.limit)
      .getMany();
  }
}
