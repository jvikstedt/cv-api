import { Controller, Get, Post, Put, Body, Delete, Param, ParseIntPipe, UseGuards, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { SkillSubjectsService } from './skill-subjects.service';
import { SkillSubject } from './skill-subject.entity';
import { CreateSkillSubjectDto } from './dto/create-skill-subject.dto';
import { UpdateSkillSubjectDto } from './dto/update-skill-subject.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchSkillSubjectDto } from './dto/search-skill-subject.dto';

@ApiBearerAuth()
@ApiTags('skill_subjects')
@Controller('skill_subjects')
@UseGuards(AuthGuard())
export class SkillSubjectsController {
  constructor(
    private readonly skillSubjectsService: SkillSubjectsService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  create(@Body() createSkillSubjectDto: CreateSkillSubjectDto): Promise<SkillSubject> {
    return this.skillSubjectsService.create(createSkillSubjectDto);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSkillSubjectDto: UpdateSkillSubjectDto): Promise<SkillSubject> {
    return this.skillSubjectsService.update(id, updateSkillSubjectDto);
  }

  @Get()
  findAll(): Promise<SkillSubject[]> {
    return this.skillSubjectsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SkillSubject> {
    return this.skillSubjectsService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.skillSubjectsService.delete(id);
  }

  @Post('/search')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  search(@Body() searchSkillSubjectDto: SearchSkillSubjectDto): Promise<SkillSubject[]> {
    return this.skillSubjectsService.search(searchSkillSubjectDto);
  }
}
