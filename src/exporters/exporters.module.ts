import { Module } from '@nestjs/common';
import { ExportersController } from './exporters.controller';
import { ExportersService } from './exporters.service';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    AuthModule,
    FilesModule,
  ],
  controllers: [ExportersController],
  providers: [ExportersService],
})
export class ExportersModule {}
