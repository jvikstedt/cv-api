import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMembership } from './project-membership.entity';
import { ProjectMembershipRepository } from './project-membership.repository';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';
import { PatchProjectMembershipDto } from './dto/patch-project-membership.dto';
import { CVService } from '../cv/cv.service';
import { SkillRepository } from '../skills/skill.repository';
import { Skill } from '../skills/skill.entity';

@Injectable()
export class ProjectMembershipService {
  constructor(
    @InjectRepository(ProjectMembershipRepository)
    private readonly projectMembershipRepository: ProjectMembershipRepository,

    @InjectRepository(SkillRepository)
    private readonly skillRepository: SkillRepository,

    private readonly cvService: CVService,
  ) {}

  async create(
    cvId: number,
    createProjectMembershipDto: CreateProjectMembershipDto,
  ): Promise<ProjectMembership> {
    let skills: Skill[] = [];

    if (!R.isEmpty(createProjectMembershipDto.skillSubjectIds)) {
      skills = await this.skillRepository.getOrCreateSkills(
        cvId,
        createProjectMembershipDto.skillSubjectIds,
      );
    }

    const projectMembership = await this.projectMembershipRepository.createProjectMembership(
      cvId,
      createProjectMembershipDto,
      skills,
    );

    await this.cvService.reload(cvId);

    return this.findOne(cvId, projectMembership.id);
  }

  async patch(
    cvId: number,
    projectMembershipId: number,
    patchProjectMembershipDto: PatchProjectMembershipDto,
  ): Promise<ProjectMembership> {
    const oldProjectMembership = await this.findOne(cvId, projectMembershipId);

    let newSkills = oldProjectMembership.skills;
    if (patchProjectMembershipDto.skillSubjectIds) {
      newSkills = await this.skillRepository.getOrCreateSkills(
        cvId,
        patchProjectMembershipDto.skillSubjectIds,
      );
    }

    const newProjectMembership = await this.projectMembershipRepository.save(
      R.mergeAll([
        oldProjectMembership,
        patchProjectMembershipDto,
        { skills: newSkills },
      ]),
    );

    await this.cvService.reload(cvId);

    return this.findOne(cvId, newProjectMembership.id);
  }

  async findAll(cvId: number): Promise<ProjectMembership[]> {
    return this.projectMembershipRepository.find({
      where: { cvId },
      join: {
        alias: 'projectMembership',
        leftJoinAndSelect: {
          project: 'projectMembership.project',
          company: 'project.company',
          skill: 'projectMembership.skills',
          skillSubject: 'skill.skillSubject',
          skillGroup: 'skillSubject.skillGroup',
        },
      },
    });
  }

  async findOne(
    cvId: number,
    projectMembershipId: number,
  ): Promise<ProjectMembership> {
    const entity = await this.projectMembershipRepository.findOne(
      { cvId, id: projectMembershipId },
      {
        join: {
          alias: 'projectMembership',
          leftJoinAndSelect: {
            project: 'projectMembership.project',
            company: 'project.company',
            skill: 'projectMembership.skills',
            skillSubject: 'skill.skillSubject',
            skillGroup: 'skillSubject.skillGroup',
          },
        },
      },
    );

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(
    cvId: number,
    projectMembershipId: number,
  ): Promise<ProjectMembership> {
    const projectMembership = await this.findOne(cvId, projectMembershipId);

    await this.projectMembershipRepository.delete({
      cvId,
      id: projectMembershipId,
    });

    await this.cvService.reload(cvId);

    return projectMembership;
  }
}
