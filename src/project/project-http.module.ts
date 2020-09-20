import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from './project.module';

@Module({
  imports: [ProjectModule, AuthModule],
  controllers: [ProjectController],
})
export class ProjectHttpModule {}
