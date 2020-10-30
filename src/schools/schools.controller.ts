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
import { SchoolsService } from './schools.service';
import { School } from './school.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { PatchSchoolDto } from './dto/patch-school.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchSchoolDto } from './dto/search-school.dto';
import { AllowAuthenticated } from '../roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('schools')
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @AllowAuthenticated()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  create(@Body() createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolsService.create(createSchoolDto);
  }

  @Patch('/:schoolId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patch(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() patchSchoolDto: PatchSchoolDto,
  ): Promise<School> {
    return this.schoolsService.patch(schoolId, patchSchoolDto);
  }

  @Get()
  @AllowAuthenticated()
  findAll(): Promise<School[]> {
    return this.schoolsService.findAll();
  }

  @Get('/:id')
  @AllowAuthenticated()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<School> {
    return this.schoolsService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.schoolsService.delete(id);
  }

  @Post('/search')
  @AllowAuthenticated()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  search(
    @Body() searchSchoolDto: SearchSchoolDto,
  ): Promise<{ items: School[]; total: number }> {
    return this.schoolsService.search(searchSchoolDto);
  }
}
