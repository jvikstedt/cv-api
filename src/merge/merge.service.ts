import * as R from 'ramda';
import { Connection } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { MergeSkillSubjectsDto } from './dto/merge-skill-subjects.dto';
import { SkillSubject } from '../skill_subjects/skill-subject.entity';
import { Skill } from '../skills/skill.entity';
import { MembershipSkill } from 'src/membership_skill/membership-skill.entity';

@Injectable()
export class MergeService {
  private readonly logger = new Logger(MergeService.name);

  constructor(private connection: Connection) {}

  async mergeSkillSubjects(
    mergeSkillSubjectsDto: MergeSkillSubjectsDto,
  ): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const source = await queryRunner.manager.findOne(
        SkillSubject,
        mergeSkillSubjectsDto.sourceId,
        {
          relations: ['skills', 'skills.membershipSkills'],
        },
      );
      const target = await queryRunner.manager.findOne(
        SkillSubject,
        mergeSkillSubjectsDto.targetId,
        {
          relations: ['skills', 'skills.membershipSkills'],
        },
      );

      for (const sourceSkill of source.skills) {
        const targetSkill = R.find(
          (s) => R.equals(sourceSkill.cvId, s.cvId),
          target.skills,
        );
        if (targetSkill) {
          for (const sourceMembershipSkill of sourceSkill.membershipSkills) {
            const targetMembershipSkill = R.find(
              (s) =>
                R.equals(
                  sourceMembershipSkill.projectMembershipId,
                  s.projectMembershipId,
                ),
              targetSkill.membershipSkills,
            );

            if (targetMembershipSkill) {
              await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(MembershipSkill)
                .where('id = :id', { id: sourceMembershipSkill.id })
                .execute();

              continue;
            }

            await queryRunner.manager
              .createQueryBuilder()
              .update(MembershipSkill)
              .set({
                skillId: targetSkill.id,
              })
              .where('id = :id', { id: sourceMembershipSkill.id })
              .execute();
          }

          await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(Skill)
            .where('id = :id', { id: sourceSkill.id })
            .execute();

          continue;
        }

        await queryRunner.manager
          .createQueryBuilder()
          .update(Skill)
          .set({
            skillSubjectId: target.id,
          })
          .where('id = :id', { id: sourceSkill.id })
          .execute();
      }

      await queryRunner.manager.findOne(
        SkillSubject,
        mergeSkillSubjectsDto.sourceId,
        {
          relations: ['skills', 'skills.membershipSkills'],
        },
      );

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(SkillSubject)
        .where('id = :id', { id: source.id })
        .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
