import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchCompanyDto } from './dto/search-company.dto';

@ApiBearerAuth()
@ApiTags('company')
@Controller('company')
@UseGuards(AuthGuard())
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
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
  findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.companyService.delete(id);
  }

  @Post('/search')
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
