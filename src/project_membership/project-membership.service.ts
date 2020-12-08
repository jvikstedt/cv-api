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
  ): Promise<void> {
    const existingMembershipSkills = await this.membershipSkillRepository.find({
      where: { projectMembershipId },
    });

    if (R.isEmpty(membershipSkills) && R.isEmpty(existingMembershipSkills)) {
      return;
    }

    const skills = await this.skillRepository.getOrCreateSkills(
      cvId,
      R.map((m) => m.skillSubjectId, membershipSkills),
    );

    for (const membershipSkill of existingMembershipSkills) {
      const foundSkill = R.find(
        (s) => R.equals(s.id, membershipSkill.skillId),
        skills,
      );

      if (!foundSkill) {
        await this.membershipSkillRepository.delete(membershipSkill.id);

        continue;
      }

      const newSettings = R.find(
        (ms) => R.equals(ms.skillSubjectId, foundSkill.skillSubjectId),
        membershipSkills,
      );

      if (!newSettings) {
        await this.membershipSkillRepository.delete(membershipSkill.id);

        continue;
      }

      if (
        !R.equals(
          newSettings.automaticCalculation,
          membershipSkill.automaticCalculation,
        ) ||
        !R.equals(
          newSettings.experienceInYears,
          membershipSkill.experienceInYears,
        )
      ) {
        membershipSkill.experienceInYears = newSettings.experienceInYears;
        membershipSkill.automaticCalculation = newSettings.automaticCalculation;
        await membershipSkill.save();
      }
    }

    for (const membershipSkill of membershipSkills) {
      const foundSkill = R.find(
        (s) => R.equals(s.skillSubjectId, membershipSkill.skillSubjectId),
        skills,
      );

      if (!foundSkill) {
        continue;
      }

      const foundExistingMembershipSkill = R.find(
        (s) => R.equals(s.skillId, foundSkill.id),
        existingMembershipSkills,
      );

      if (foundExistingMembershipSkill) {
        continue;
      }

      await this.membershipSkillRepository
        .create({
          skillId: foundSkill.id,
          projectMembershipId: projectMembershipId,
          automaticCalculation: membershipSkill.automaticCalculation,
          experienceInYears: membershipSkill.experienceInYears,
        })
        .save();
    }
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
