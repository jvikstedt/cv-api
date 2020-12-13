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
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { CVOwnerPolicy } from '../cv/policies';

@ApiBearerAuth()
@ApiTags('project_membership')
@Controller('cv/:cvId/project_membership')
export class ProjectMembershipController {
  constructor(
    private readonly projectMembershipService: ProjectMembershipService,
  ) {}

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
    @Body() createProjectMembershipDto: CreateProjectMembershipDto,
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.create(
      cvId,
      createProjectMembershipDto,
    );
  }

  @Patch('/:projectMembershipId')
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
  @Authenticated()
  findAll(
    @Param('cvId', ParseIntPipe) cvId: number,
  ): Promise<ProjectMembership[]> {
    return this.projectMembershipService.findAll(cvId);
  }

  @Get('/:projectMembershipId')
  @Authenticated()
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('projectMembershipId', ParseIntPipe) projectMembershipId: number,
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.findOne(cvId, projectMembershipId);
  }

  @Delete('/:projectMembershipId')
  @CheckPolicies(CVOwnerPolicy)
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('projectMembershipId', ParseIntPipe) projectMembershipId: number,
  ): Promise<ProjectMembership> {
    return this.projectMembershipService.remove(cvId, projectMembershipId);
  }
}
