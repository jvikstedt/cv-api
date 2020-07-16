import { Module } from '@nestjs/common';
import { ProjectMembershipService } from './project-membership.service';
import { ProjectMembershipController } from './project-membership.controller';
import { AuthModule } from '../auth/auth.module';
import { ProjectMembershipModule } from './project-membership.module';
import { CVModule } from '../cv/cv.module';

@Module({
  imports: [
    ProjectMembershipModule,
    AuthModule,
    CVModule,
  ],
  controllers: [ProjectMembershipController],
  providers: [ProjectMembershipService],
})
export class ProjectMembershipHttpModule {}
