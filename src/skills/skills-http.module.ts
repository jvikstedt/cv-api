import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { AuthModule } from '../auth/auth.module';
import { SkillsModule } from './skills.module';
import { CVModule } from '../cv/cv.module';

@Module({
  imports: [
    SkillsModule,
    AuthModule,
    CVModule,
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsHttpModule {}
