import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, UseGuards, Patch, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { PatchProjectDto } from './dto/patch-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchProjectDto } from './dto/search-project.dto';

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
@UseGuards(AuthGuard())
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(createProjectDto);
  }

  @Patch('/:projectId')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  patch(@Param('projectId', ParseIntPipe) projectId: number, @Body() patchProjectDto: PatchProjectDto): Promise<Project> {
    return this.projectService.patch(projectId, patchProjectDto);
  }

  @Get()
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.projectService.delete(id);
  }

  @Post('/search')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  search(@Body() searchProjectDto: SearchProjectDto): Promise<Project[]> {
    return this.projectService.search(searchProjectDto);
  }
}
