import { MembershipSkill } from './membership-skill.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(MembershipSkill)
export class MembershipSkillRepository extends Repository<MembershipSkill> {}
