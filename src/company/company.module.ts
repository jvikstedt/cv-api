import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from './company.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRepository]),
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class CompanyModule {}
