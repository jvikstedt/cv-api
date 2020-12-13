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
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { DeleteSchoolPolicy, UpdateSchoolPolicy } from './policies';

@ApiBearerAuth()
@ApiTags('schools')
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

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
  create(@Body() createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolsService.create(createSchoolDto);
  }

  @Patch('/:schoolId')
  @CheckPolicies(UpdateSchoolPolicy)
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
  @Authenticated()
  findAll(): Promise<School[]> {
    return this.schoolsService.findAll();
  }

  @Get('/:schoolId')
  @Authenticated()
  findOne(@Param('schoolId', ParseIntPipe) id: number): Promise<School> {
    return this.schoolsService.findOne(id);
  }

  @Delete('/:schoolId')
  @CheckPolicies(DeleteSchoolPolicy)
  delete(@Param('schoolId', ParseIntPipe) id: number): Promise<void> {
    return this.schoolsService.delete(id);
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
    @Body() searchSchoolDto: SearchSchoolDto,
  ): Promise<{ items: School[]; total: number }> {
    return this.schoolsService.search(searchSchoolDto);
  }
}
