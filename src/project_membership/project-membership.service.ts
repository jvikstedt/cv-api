import * as R from 'ramda';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMembership } from './project-membership.entity';
import { ProjectMembershipRepository } from './project-membership.repository';
import {
  CreateProjectMembershipDto,
  MembershipSkillDto,
} from './dto/create-project-membership.dto';
import { PatchProjectMembershipDto } from './dto/patch-project-membership.dto';
import { CVService } from '../cv/cv.service';
import { MembershipSkill } from '../membership_skill/membership-skill.entity';
import { MembershipSkillRepository } from '../membership_skill/membership-skill.repository';
import { SkillRepository } from '../skills/skill.repository';

@Injectable()
export class ProjectMembershipService {
  constructor(
    @InjectRepository(ProjectMembershipRepository)
    private readonly projectMembershipRepository: ProjectMembershipRepository,

    @InjectRepository(SkillRepository)
    private readonly skillRepository: SkillRepository,

    @InjectRepository(MembershipSkillRepository)
    private readonly membershipSkillRepository: MembershipSkillRepository,

    private readonly cvService: CVService,
  ) {}

  async updateMembershipSkills(
    cvId: number,
    projectMembershipId: number,
    membershipSkills: MembershipSkillDto[],
  ): Promise<MembershipSkill[]> {
    await this.membershipSkillRepository.delete({
      projectMembershipId,
    });

    if (R.isEmpty(membershipSkills)) {
      return [];
    }

    const skills = await this.skillRepository.getOrCreateSkills(
      cvId,
      R.map((m) => m.skillSubjectId, membershipSkills),
    );

    const savedMembershipSkills: MembershipSkill[] = [];
    for (const skill of skills) {
      const membershipSkill = R.find(
        (m) => R.equals(m.skillSubjectId, skill.skillSubjectId),
        membershipSkills,
      );

      if (!membershipSkill) {
        continue;
      }

      const createdMembershipSkill = await this.membershipSkillRepository
        .create({
          skillId: skill.id,
          projectMembershipId: projectMembershipId,
          automaticCalculation: membershipSkill.automaticCalculation,
          experienceInYears: membershipSkill.experienceInYears,
        })
        .save();

      savedMembershipSkills.push(createdMembershipSkill);
    }

    return savedMembershipSkills;
  }

  async create(
    cvId: number,
    createProjectMembershipDto: CreateProjectMembershipDto,
  ): Promise<ProjectMembership> {
    const projectMembership = await this.projectMembershipRepository.createProjectMembership(
      cvId,
      createProjectMembershipDto,
    );

    await this.updateMembershipSkills(
      cvId,
      projectMembership.id,
      createProjectMembershipDto.membershipSkills,
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

    const newProjectMembership = await this.projectMembershipRepository.save(
      R.omit(
        ['project'],
        R.merge(
          oldProjectMembership,
          R.omit(['membershipSkills'], patchProjectMembershipDto),
        ),
      ),
    );

    if (patchProjectMembershipDto.membershipSkills) {
      await this.updateMembershipSkills(
        cvId,
        newProjectMembership.id,
        patchProjectMembershipDto.membershipSkills,
      );
    }
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
          membershipSkills: 'projectMembership.membershipSkills',
          skill: 'membershipSkills.skill',
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
            membershipSkills: 'projectMembership.membershipSkills',
            skill: 'membershipSkills.skill',
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
