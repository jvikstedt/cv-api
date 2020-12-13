import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PatchCompanyDto } from './dto/patch-company.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchCompanyDto } from './dto/search-company.dto';
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { DeleteCompanyPolicy, UpdateCompanyPolicy } from './policies';

@ApiBearerAuth()
@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Authenticated()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Patch('/:companyId')
  @CheckPolicies(UpdateCompanyPolicy)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patch(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() patchCompanyDto: PatchCompanyDto,
  ): Promise<Company> {
    return this.companyService.patch(companyId, patchCompanyDto);
  }

  @Get()
  @Authenticated()
  findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get('/:id')
  @Authenticated()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Delete('/:id')
  @CheckPolicies(DeleteCompanyPolicy)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.companyService.delete(id);
  }

  @Post('/search')
  @Authenticated()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  search(
    @Body() searchCompanyDto: SearchCompanyDto,
  ): Promise<{ items: Company[]; total: number }> {
    return this.companyService.search(searchCompanyDto);
  }
}
