import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, UseGuards, Patch, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ProjectMembershipService } from './project-membership.service';
import { ProjectMembership } from './project-membership.entity';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchProjectMembershipDto } from './dto/patch-project-membership.dto';
import { CVGuard } from '../cv/cv.guard';

@ApiBearerAuth()
@ApiTags('project_membership')
@Controller('cv/:cvId/project_membership')
@UseGuards(AuthGuard())
export class ProjectMembershipController {
  constructor(
    private readonly projectMembershipService: ProjectMembershipService,
  ) {}

  @Post()
  @UseGuards(CVGuard)
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  create(@Param('cvId', ParseIntPipe) cvId: number, @Body() createProjectMembershipDto: CreateProjectMembershipDto): Promise<ProjectMembership> {
    return this.projectMembershipService.create(cvId, createProjectMembershipDto);
  }

  @Patch('/:projectMembershipId')
  @UseGuards(CVGuard)
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  patch(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('projectMembershipId', ParseIntPipe) projectMembershipId: number,
    @Body() patchProjectMembershipDto: PatchProjectMembershipDto
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.patch(cvId, projectMembershipId, patchProjectMembershipDto);
  }

  @Get()
  findAll(@Param('cvId', ParseIntPipe) cvId: number): Promise<ProjectMembership[]> {
    return this.projectMembershipService.findAll(cvId);
  }

  @Get('/:projectMembershipId')
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('projectMembershipId', ParseIntPipe) projectMembershipId: number,
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.findOne(cvId, projectMembershipId);
  }

  @Delete('/:projectMembershipId')
  @UseGuards(CVGuard)
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('projectMembershipId', ParseIntPipe) projectMembershipId: number
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.remove(cvId, projectMembershipId);
  }
}
