import { Controller, Get, Post, Put, Body, Delete, Param, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchSkillDto } from './dto/patch-skill.dto';

@ApiBearerAuth()
@ApiTags('skills')
@Controller('skills')
@UseGuards(AuthGuard())
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillsService.create(createSkillDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSkillDto: UpdateSkillDto): Promise<Skill> {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  patchSkill(@Param('id', ParseIntPipe) id: number, @Body() patchSkillDto: PatchSkillDto): Promise<Skill> {
    return this.skillsService.patchSkill(id, patchSkillDto);
  }

  @Get()
  findAll(): Promise<Skill[]> {
    return this.skillsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Skill> {
    return this.skillsService.findOne(id);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Skill> {
    return this.skillsService.remove(id);
  }
}
