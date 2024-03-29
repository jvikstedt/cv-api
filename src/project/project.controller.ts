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
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { PatchProjectDto } from './dto/patch-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchProjectDto } from './dto/search-project.dto';
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { DeleteProjectPolicy, UpdateProjectPolicy } from './policies';

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
  create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(createProjectDto);
  }

  @Patch('/:projectId')
  @CheckPolicies(UpdateProjectPolicy)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patch(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() patchProjectDto: PatchProjectDto,
  ): Promise<Project> {
    return this.projectService.patch(projectId, patchProjectDto);
  }

  @Get()
  @Authenticated()
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get('/:projectId')
  @Authenticated()
  findOne(@Param('projectId', ParseIntPipe) id: number): Promise<Project> {
    return this.projectService.findOne(id);
  }

  @Delete('/:projectId')
  @CheckPolicies(DeleteProjectPolicy)
  delete(@Param('projectId', ParseIntPipe) id: number): Promise<void> {
    return this.projectService.delete(id);
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
    @Body() searchProjectDto: SearchProjectDto,
  ): Promise<{ items: Project[]; total: number }> {
    return this.projectService.search(searchProjectDto);
  }
}
