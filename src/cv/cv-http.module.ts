import { Module } from '@nestjs/common';
import { CVController } from './cv.controller';
import { AuthModule } from '../auth/auth.module';
import { CVModule } from './cv.module';

@Module({
  imports: [CVModule, AuthModule],
  controllers: [CVController],
})
export class CVHttpModule {}
