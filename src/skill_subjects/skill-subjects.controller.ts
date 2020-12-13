import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpException,
  Patch,
} from '@nestjs/common';
import { SkillSubjectsService } from './skill-subjects.service';
import { SkillSubject } from './skill-subject.entity';
import { CreateSkillSubjectDto } from './dto/create-skill-subject.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchSkillSubjectDto } from './dto/search-skill-subject.dto';
import { PatchSkillSubjectDto } from './dto/patch-skill-subject.dto';
import { Authenticated } from '../authorization/authorization.decorator';

@ApiBearerAuth()
@ApiTags('skill_subjects')
@Controller('skill_subjects')
export class SkillSubjectsController {
  constructor(private readonly skillSubjectsService: SkillSubjectsService) {}

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
  create(
    @Body() createSkillSubjectDto: CreateSkillSubjectDto,
  ): Promise<SkillSubject> {
    return this.skillSubjectsService.create(createSkillSubjectDto);
  }

  @Patch('/:skillSubjectId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patch(
    @Param('skillSubjectId', ParseIntPipe) skillSubjectId: number,
    @Body() patchSkillSubjectDto: PatchSkillSubjectDto,
  ): Promise<SkillSubject> {
    return this.skillSubjectsService.patch(
      skillSubjectId,
      patchSkillSubjectDto,
    );
  }

  @Get()
  @Authenticated()
  findAll(): Promise<SkillSubject[]> {
    return this.skillSubjectsService.findAll();
  }

  @Get('/:id')
  @Authenticated()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SkillSubject> {
    return this.skillSubjectsService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.skillSubjectsService.delete(id);
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
    @Body() searchSkillSubjectDto: SearchSkillSubjectDto,
  ): Promise<{ items: SkillSubject[]; total: number }> {
    return this.skillSubjectsService.search(searchSkillSubjectDto);
  }
}
