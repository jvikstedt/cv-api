import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CVRepository } from './cv.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CVRepository]),
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class CVModule {}
