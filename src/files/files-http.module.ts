import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from './files.module';

@Module({
  imports: [
    FilesModule,
    AuthModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesHttpModule {}
