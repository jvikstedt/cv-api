import { Module } from '@nestjs/common';
import { ProjectMembershipController } from './project-membership.controller';
import { AuthModule } from '../auth/auth.module';
import { ProjectMembershipModule } from './project-membership.module';

@Module({
  imports: [ProjectMembershipModule, AuthModule],
  controllers: [ProjectMembershipController],
})
export class ProjectMembershipHttpModule {}
