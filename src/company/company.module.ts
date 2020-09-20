import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from './company.repository';
import { CompanyService } from './company.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRepository])],
  providers: [CompanyService],
  exports: [TypeOrmModule, CompanyService],
})
export class CompanyModule {}
