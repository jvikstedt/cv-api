import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMembershipRepository } from './project-membership.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMembershipRepository]),
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class ProjectMembershipModule {}
