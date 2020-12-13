import { Module } from '@nestjs/common';
import { CVController } from './cv.controller';
import { AuthModule } from '../auth/auth.module';
import { CVModule } from './cv.module';
import { CVOwnerPolicy } from './policies';

@Module({
  imports: [CVModule, AuthModule],
  controllers: [CVController],
  providers: [CVOwnerPolicy],
})
export class CVHttpModule {}
