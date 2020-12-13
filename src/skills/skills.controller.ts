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
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { CVOwnerPolicy } from '../cv/policies';

@ApiBearerAuth()
@ApiTags('skills')
@Controller('cv/:cvId/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @CheckPolicies(CVOwnerPolicy)
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
  @CheckPolicies(CVOwnerPolicy)
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
  @Authenticated()
  findAll(@Param('cvId', ParseIntPipe) cvId: number): Promise<Skill[]> {
    return this.skillsService.findAll(cvId);
  }

  @Get('/:skillId')
  @Authenticated()
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Skill> {
    return this.skillsService.findOne(cvId, skillId);
  }

  @Delete('/:skillId')
  @CheckPolicies(CVOwnerPolicy)
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Skill> {
    return this.skillsService.remove(cvId, skillId);
  }
}
