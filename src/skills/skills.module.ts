import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillRepository } from './skill.repository';
import { CVModule } from '../cv/cv.module';
import { SkillsService } from './skills.service';

@Module({
  imports: [TypeOrmModule.forFeature([SkillRepository]), CVModule],
  providers: [SkillsService],
  exports: [TypeOrmModule, SkillsService],
})
export class SkillsModule {}
