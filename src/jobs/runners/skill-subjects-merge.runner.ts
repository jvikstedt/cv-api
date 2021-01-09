import * as R from 'ramda';
import { Connection, QueryRunner } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Job } from '../../jobs/job.entity';
import { SkillSubject } from '../../skill_subjects/skill-subject.entity';
import { Skill } from '../../skills/skill.entity';
import { MembershipSkill } from '../../membership_skill/membership-skill.entity';
import { JobRunner } from '../job-runner';

@Injectable()
export class SkillSubjectsMergeJobRunner implements JobRunner {
  public static RunnerName = 'SkillSubjectMerge';

  constructor(private connection: Connection) {}

  public name(): string {
    return SkillSubjectsMergeJobRunner.RunnerName;
  }

  public async run(job: Job): Promise<void> {
    const { sourceId, targetId } = job.data;
    return this.merge(sourceId, targetId);
  }

  public async merge(sourceId: number, targetId: number): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const source = await queryRunner.manager.findOne(SkillSubject, sourceId, {
        relations: ['skills', 'skills.membershipSkills'],
      });
      const target = await queryRunner.manager.findOne(SkillSubject, targetId, {
        relations: ['skills', 'skills.membershipSkills'],
      });

      if (!source || !target) {
        throw new NotFoundException();
      }

      if (R.equals(source.id, target.id)) {
        throw new Error(
          `source (${source.id}) and target (${target.id}) can't be same`,
        );
      }

      for (const sourceSkill of source.skills) {
        // Find out if source & target skill subjects are both in the same cv
        const targetSkill = R.find(
          (s) => R.equals(sourceSkill.cvId, s.cvId),
          target.skills,
        );
        if (targetSkill) {
          // Merge source skill to target skill
          await this.mergeSkills(queryRunner, sourceSkill, targetSkill);
        } else {
          // Point source skill to target skill subject
          await queryRunner.manager
            .createQueryBuilder()
            .update(Skill)
            .set({
              skillSubjectId: target.id,
            })
            .where('id = :id', { id: sourceSkill.id })
            .execute();
        }
      }

      // Delete skill subject after all associations has been moves
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(SkillSubject)
        .where('id = :id', { id: source.id })
        .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  public async mergeSkills(
    queryRunner: QueryRunner,
    sourceSkill: Skill,
    targetSkill: Skill,
  ): Promise<void> {
    for (const sourceMembershipSkill of sourceSkill.membershipSkills) {
      // Find out if source & target skills are both in the same project membership
      const targetMembershipSkill = R.find(
        (s) =>
          R.equals(
            sourceMembershipSkill.projectMembershipId,
            s.projectMembershipId,
          ),
        targetSkill.membershipSkills,
      );

      if (targetMembershipSkill) {
        // Delete membership skill as it already exists
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(MembershipSkill)
          .where('id = :id', { id: sourceMembershipSkill.id })
          .execute();
      } else {
        // Point source membership skill to target skill
        await queryRunner.manager
          .createQueryBuilder()
          .update(MembershipSkill)
          .set({
            skillId: targetSkill.id,
          })
          .where('id = :id', { id: sourceMembershipSkill.id })
          .execute();
      }
    }

    // Delete the source skill after associations has been moved or removed
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Skill)
      .where('id = :id', { id: sourceSkill.id })
      .execute();
  }
}
