import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { School } from './school.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { PatchSchoolDto } from './dto/patch-school.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchSchoolDto } from './dto/search-school.dto';

@ApiBearerAuth()
@ApiTags('schools')
@Controller('schools')
@UseGuards(AuthGuard())
export class SchoolsController {
  constructor(
    private readonly schoolsService: SchoolsService,
  ) {}

  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolsService.create(createSchoolDto);
  }

  @Patch('/:schoolId')
  patch(@Param('schoolId', ParseIntPipe) schoolId: number, @Body() patchSchoolDto: PatchSchoolDto): Promise<School> {
    return this.schoolsService.patch(schoolId, patchSchoolDto);
  }

  @Get()
  findAll(): Promise<School[]> {
    return this.schoolsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<School> {
    return this.schoolsService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.schoolsService.delete(id);
  }

  @Post('/search')
  search(@Body() searchSchoolDto: SearchSchoolDto): Promise<School[]> {
    return this.schoolsService.search(searchSchoolDto);
  }
}