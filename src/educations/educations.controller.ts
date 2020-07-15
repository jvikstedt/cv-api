import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { EducationsService } from './educations.service';
import { Education } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchEducationDto } from './dto/patch-education.dto';
import { CVGuard } from '../cv/cv.guard';

@ApiBearerAuth()
@ApiTags('educations')
@Controller('cv/:cvId/educations')
@UseGuards(AuthGuard())
export class EducationsController {
  constructor(
    private readonly educationsService: EducationsService,
  ) {}

  @Post()
  @UseGuards(CVGuard)
  create(@Param('cvId', ParseIntPipe) cvId: number, @Body() createEducationDto: CreateEducationDto): Promise<Education> {
    return this.educationsService.create(cvId, createEducationDto);
  }

  @Patch('/:educationId')
  @UseGuards(CVGuard)
  patch(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('educationId', ParseIntPipe) educationId: number,
    @Body() patchEducationDto: PatchEducationDto
  ): Promise<Education> {
    return this.educationsService.patch(cvId, educationId, patchEducationDto);
  }

  @Get()
  findAll(@Param('cvId', ParseIntPipe) cvId: number): Promise<Education[]> {
    return this.educationsService.findAll(cvId);
  }

  @Get('/:educationId')
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('educationId', ParseIntPipe) educationId: number,
  ): Promise<Education> {
    return this.educationsService.findOne(cvId, educationId);
  }

  @Delete('/:educationId')
  @UseGuards(CVGuard)
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('educationId', ParseIntPipe) educationId: number
  ): Promise<Education> {
    return this.educationsService.remove(cvId, educationId);
  }
}
