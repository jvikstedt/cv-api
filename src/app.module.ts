import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillSubjectsHttpModule } from './skill_subjects/skill-subjects-http.module';
import { SkillGroupsHttpModule } from './skill_groups/skill-groups-http.module';
import { SkillsHttpModule } from './skills/skills-http.module';
import { typeOrmConfig } from './config/typeorm.config';
import { CVHttpModule } from './cv/cv-http.module';
import { HealthModule } from './health/health.module';
import { ExportersModule } from './exporters/exporters.module';
import { UsersHttpModule } from './users/users-http.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesHttpModule } from './templates/templates-http.module';
import { FilesHttpModule } from './files/files-http.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    HealthModule,
    ExportersModule,
    SkillSubjectsHttpModule,
    SkillGroupsHttpModule,
    SkillsHttpModule,
    UsersHttpModule,
    CVHttpModule,
    TemplatesHttpModule,
    FilesHttpModule,
  ],
})
export class AppModule {}
