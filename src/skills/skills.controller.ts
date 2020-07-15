import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchSkillDto } from './dto/patch-skill.dto';
import { CVGuard } from '../cv/cv.guard';

@ApiBearerAuth()
@ApiTags('skills')
@Controller('cv/:cvId/skills')
@UseGuards(AuthGuard())
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
  ) {}

  @Post()
  @UseGuards(CVGuard)
  create(@Param('cvId', ParseIntPipe) cvId: number, @Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillsService.create(cvId, createSkillDto);
  }

  @Patch('/:skillId')
  @UseGuards(CVGuard)
  patch(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
    @Body() patchSkillDto: PatchSkillDto
  ): Promise<Skill> {
    return this.skillsService.patch(cvId, skillId, patchSkillDto);
  }

  @Get()
  findAll(@Param('cvId', ParseIntPipe) cvId: number): Promise<Skill[]> {
    return this.skillsService.findAll(cvId);
  }

  @Get('/:skillId')
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Skill> {
    return this.skillsService.findOne(cvId, skillId);
  }

  @Delete('/:skillId')
  @UseGuards(CVGuard)
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number
  ): Promise<Skill> {
    return this.skillsService.remove(cvId, skillId);
  }
}
