import { Module } from '@nestjs/common';
import { ExportersController } from './exporters.controller';
import { ExportersService } from './exporters.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [ExportersController],
  providers: [ExportersService],
})
export class ExportersModule {}
