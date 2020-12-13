import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from './company.module';
import { DeleteCompanyPolicy, UpdateCompanyPolicy } from './policies';

@Module({
  imports: [CompanyModule, AuthModule],
  controllers: [CompanyController],
  providers: [DeleteCompanyPolicy, UpdateCompanyPolicy],
})
export class CompanyHttpModule {}
