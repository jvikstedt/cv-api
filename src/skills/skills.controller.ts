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
import { SkillsService } from './skills.service';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchSkillDto } from './dto/patch-skill.dto';
import { AllowAuthenticated, AllowCVOwner } from '../roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('skills')
@Controller('cv/:cvId/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @AllowCVOwner()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  create(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<Skill> {
    return this.skillsService.create(cvId, createSkillDto);
  }

  @Patch('/:skillId')
  @AllowCVOwner()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patch(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
    @Body() patchSkillDto: PatchSkillDto,
  ): Promise<Skill> {
    return this.skillsService.patch(cvId, skillId, patchSkillDto);
  }

  @Get()
  @AllowAuthenticated()
  findAll(@Param('cvId', ParseIntPipe) cvId: number): Promise<Skill[]> {
    return this.skillsService.findAll(cvId);
  }

  @Get('/:skillId')
  @AllowAuthenticated()
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Skill> {
    return this.skillsService.findOne(cvId, skillId);
  }

  @Delete('/:skillId')
  @AllowCVOwner()
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Skill> {
    return this.skillsService.remove(cvId, skillId);
  }
}
