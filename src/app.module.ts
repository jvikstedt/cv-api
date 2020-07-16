import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillSubjectsHttpModule } from './skill_subjects/skill-subjects-http.module';
import { SkillGroupsHttpModule } from './skill_groups/skill-groups-http.module';
import { SkillsHttpModule } from './skills/skills-http.module';
import { EducationsHttpModule } from './educations/educations-http.module';
import { WorkExperienceHttpModule } from './work_experience/work-experience-http.module';
import { CVHttpModule } from './cv/cv-http.module';
import { HealthModule } from './health/health.module';
import { ExportersModule } from './exporters/exporters.module';
import { UsersHttpModule } from './users/users-http.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesHttpModule } from './templates/templates-http.module';
import { FilesHttpModule } from './files/files-http.module';
import { SchoolsHttpModule } from './schools/schools-http.module';
import { CompanyHttpModule } from './company/company-http.module';
import typeOrmConfig = require("./config/typeorm.config");

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    HealthModule,
    ExportersModule,
    SkillSubjectsHttpModule,
    SkillGroupsHttpModule,
    SkillsHttpModule,
    EducationsHttpModule,
    WorkExperienceHttpModule,
    UsersHttpModule,
    CVHttpModule,
    TemplatesHttpModule,
    FilesHttpModule,
    SchoolsHttpModule,
    CompanyHttpModule,
  ],
})
export class AppModule {}
