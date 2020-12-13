import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from './project.module';
import { DeleteProjectPolicy, UpdateProjectPolicy } from './policies';

@Module({
  imports: [ProjectModule, AuthModule],
  controllers: [ProjectController],
  providers: [DeleteProjectPolicy, UpdateProjectPolicy],
})
export class ProjectHttpModule {}
