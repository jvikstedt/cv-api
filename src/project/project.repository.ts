import { Project } from './project.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const { name } = createProjectDto;

    const project = this.create({ name });
    return project.save();
  }
}
