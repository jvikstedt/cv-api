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
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroup } from './skill-group.entity';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchSkillGroupDto } from './dto/search-skill-group.dto';
import { PatchSkillGroupDto } from './dto/patch-skill-group.dto';
import { AllowAuthenticated } from '../roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('skill_groups')
@Controller('skill_groups')
export class SkillGroupsController {
  constructor(private readonly skillGroupsService: SkillGroupsService) {}

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
  create(
    @Body() createSkillGroupDto: CreateSkillGroupDto,
  ): Promise<SkillGroup> {
    return this.skillGroupsService.create(createSkillGroupDto);
  }

  @Patch('/:skillGroupId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patch(
    @Param('skillGroupId', ParseIntPipe) skillGroupId: number,
    @Body() patchSkillGroupDto: PatchSkillGroupDto,
  ): Promise<SkillGroup> {
    return this.skillGroupsService.patch(skillGroupId, patchSkillGroupDto);
  }

  @Get()
  @AllowAuthenticated()
  findAll(): Promise<SkillGroup[]> {
    return this.skillGroupsService.findAll();
  }

  @Get('/:skillGroupId')
  @AllowAuthenticated()
  findOne(
    @Param('skillGroupId', ParseIntPipe) skillGroupId: number,
  ): Promise<SkillGroup> {
    return this.skillGroupsService.findOne(skillGroupId);
  }

  @Delete('/:skillGroupId')
  delete(
    @Param('skillGroupId', ParseIntPipe) skillGroupId: number,
  ): Promise<void> {
    return this.skillGroupsService.delete(skillGroupId);
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
    @Body() searchSkillGroupDto: SearchSkillGroupDto,
  ): Promise<{ items: SkillGroup[]; total: number }> {
    return this.skillGroupsService.search(searchSkillGroupDto);
  }
}
