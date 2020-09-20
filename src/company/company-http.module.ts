import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from './company.module';

@Module({
  imports: [CompanyModule, AuthModule],
  controllers: [CompanyController],
})
export class CompanyHttpModule {}
