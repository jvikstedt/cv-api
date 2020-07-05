import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { SkillSubscriber } from './skill.subscriber';
import { AuthModule } from '../auth/auth.module';
import { SkillsModule } from './skills.module';

@Module({
  imports: [
    SkillsModule,
    AuthModule,
  ],
  controllers: [SkillsController],
  providers: [SkillsService, SkillSubscriber],
})
export class SkillsHttpModule {}
