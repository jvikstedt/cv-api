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
import { ProjectMembershipService } from './project-membership.service';
import { ProjectMembership } from './project-membership.entity';
import { CreateProjectMembershipDto } from './dto/create-project-membership.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchProjectMembershipDto } from './dto/patch-project-membership.dto';
import { AllowAuthenticated, AllowCVOwner } from '../roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('project_membership')
@Controller('cv/:cvId/project_membership')
export class ProjectMembershipController {
  constructor(
    private readonly projectMembershipService: ProjectMembershipService,
  ) {}

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
    @Body() createProjectMembershipDto: CreateProjectMembershipDto,
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.create(
      cvId,
      createProjectMembershipDto,
    );
  }

  @Patch('/:projectMembershipId')
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
    @Param('projectMembershipId', ParseIntPipe) projectMembershipId: number,
    @Body() patchProjectMembershipDto: PatchProjectMembershipDto,
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.patch(
      cvId,
      projectMembershipId,
      patchProjectMembershipDto,
    );
  }

  @Get()
  @AllowAuthenticated()
  findAll(
    @Param('cvId', ParseIntPipe) cvId: number,
  ): Promise<ProjectMembership[]> {
    return this.projectMembershipService.findAll(cvId);
  }

  @Get('/:projectMembershipId')
  @AllowAuthenticated()
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('projectMembershipId', ParseIntPipe) projectMembershipId: number,
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.findOne(cvId, projectMembershipId);
  }

  @Delete('/:projectMembershipId')
  @AllowCVOwner()
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('projectMembershipId', ParseIntPipe) projectMembershipId: number,
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.remove(cvId, projectMembershipId);
  }
}
