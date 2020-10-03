import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipSkillRepository } from './membership-skill.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipSkillRepository])],
  exports: [TypeOrmModule],
})
export class MembershipSkillModule {}
